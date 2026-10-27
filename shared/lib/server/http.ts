import 'server-only'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/shared/lib/auth/auth-options'
import { ZodError } from 'zod'

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
    }
}
export function checkOrigin(request: Request) {
    const expected = process.env.NEXTAUTH_URL
    const allowed = new Set([
        ...(expected ? [new URL(expected).origin] : []),
        ...(process.env.APP_ALLOWED_ORIGINS || '')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
    ])
    if (!expected || !allowed.has(request.headers.get('origin') || '')) {
        throw new HttpError(403, 'Недопустимый источник запроса')
    }
}
export async function requireAdmin(request?: Request) {
    if (request && !['GET', 'HEAD'].includes(request.method))
        checkOrigin(request)
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin)
        throw new HttpError(401, 'Требуется вход администратора')
}
export async function readBody(request: Request, limit: number) {
    if (Number(request.headers.get('content-length')) > limit)
        throw new HttpError(413, 'Слишком большой запрос')
    const reader = request.body?.getReader()
    if (!reader) throw new HttpError(400, 'Пустой запрос')
    const chunks: Uint8Array[] = []
    let size = 0
    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.length
            if (size > limit) {
                await reader.cancel()
                throw new HttpError(413, 'Слишком большой запрос')
            }
            chunks.push(value)
        }
    } finally {
        reader.releaseLock()
    }
    return Buffer.concat(chunks)
}
export async function readJson(request: Request) {
    if (!request.headers.get('content-type')?.startsWith('application/json'))
        throw new HttpError(415, 'Ожидается JSON')
    const bytes = await readBody(request, 32768)
    try {
        return JSON.parse(bytes.toString('utf8'))
    } catch {
        throw new HttpError(400, 'Некорректный JSON')
    }
}
export function apiError(error: unknown) {
    if (error instanceof HttpError)
        return Response.json({ error: error.message }, { status: error.status })
    if (error instanceof ZodError)
        return Response.json(
            { error: 'Проверьте заполнение полей' },
            { status: 400 }
        )
    console.error('API operation failed')
    return Response.json(
        { error: 'Сервис временно недоступен. Повторите позже.' },
        { status: 503 }
    )
}
