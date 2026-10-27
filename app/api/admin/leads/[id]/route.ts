import {
    requireAdmin,
    apiError,
    readJson,
    HttpError,
} from '@/shared/lib/server/http'
import { database } from '@/shared/lib/server/db'
import { z } from 'zod'
type Context = { params: Promise<{ id: string }> }
export async function PATCH(request: Request, context: Context) {
    try {
        await requireAdmin(request)
        const { id } = await context.params
        z.uuid().parse(id)
        const data = z
            .object({
                status: z.enum(['new', 'processing', 'closed']).optional(),
                retry: z.boolean().optional(),
            })
            .parse(await readJson(request))
        if (data.status)
            await database().query('UPDATE leads SET status=$2 WHERE id=$1', [
                id,
                data.status,
            ])
        // Only exhausted deliveries can be retried; sent mail is never resent here.
        if (data.retry)
            await database().query(
                `UPDATE mail_outbox SET status='pending',attempts=0,next_attempt_at=now() WHERE lead_id=$1 AND status='failed'`,
                [id]
            )
        return Response.json({ ok: true })
    } catch (error) {
        return apiError(error)
    }
}
export async function DELETE(request: Request, context: Context) {
    try {
        await requireAdmin(request)
        const { id } = await context.params
        z.uuid().parse(id)
        const result = await database().query('DELETE FROM leads WHERE id=$1', [
            id,
        ])
        if (!result.rowCount) throw new HttpError(404, 'Заявка не найдена')
        return Response.json({ ok: true })
    } catch (error) {
        return apiError(error)
    }
}
