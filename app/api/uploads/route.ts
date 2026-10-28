import { requireAdmin, readBody, apiError, HttpError } from '@/shared/lib/server/http'
import { database } from '@/shared/lib/server/db'
import { mkdir, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
export const runtime = 'nodejs'
export async function POST(request: Request) {
    let target: string | undefined
    try {
        await requireAdmin(request)
        const bytes = await readBody(request, 11 * 1024 * 1024)
        const form = await new Response(new Uint8Array(bytes), {
            headers: { 'Content-Type': request.headers.get('content-type') || '' },
        }).formData()
        const file = form.get('file')
        if (!(file instanceof File) || file.size > 10 * 1024 * 1024 || file.size === 0)
            throw new HttpError(400, 'Допустим файл изображения до 10 МБ')
        const input = Buffer.from(await file.arrayBuffer())
        const image = sharp(input, { limitInputPixels: 40000000, animated: false })
        const metadata = await image.metadata().catch(() => {
            throw new HttpError(400, 'Не удалось прочитать изображение')
        })
        if (!['jpeg', 'png', 'webp'].includes(metadata.format || '') || (metadata.pages || 1) > 1)
            throw new HttpError(400, 'Допустимы JPG, PNG и WebP')
        const output = await image
            .rotate()
            .resize({ width: 4000, height: 4000, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer()
        const directory = process.env.UPLOAD_DIR || '/app/uploads'
        await mkdir(directory, { recursive: true })
        const filename = randomUUID() + '.webp'
        target = path.join(directory, filename)
        await writeFile(target, output, { flag: 'wx', mode: 0o644 })
        await database().query('INSERT INTO media(filename) VALUES($1)', [filename])
        return Response.json({ url: '/media/' + filename }, { status: 201 })
    } catch (error) {
        if (target) await unlink(target).catch(() => {})
        return apiError(error)
    }
}
