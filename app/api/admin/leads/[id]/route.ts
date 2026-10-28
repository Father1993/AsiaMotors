import { requireAdmin, apiError, readJson, HttpError } from '@/shared/lib/server/http'
import { database } from '@/shared/lib/server/db'
import { z } from 'zod'
import { getAdminLead, updateAdminLead, mailDeliveryEnabled } from '@/shared/lib/server/leads'
type Context = { params: Promise<{ id: string }> }
export async function GET(_request: Request, context: Context) {
    try {
        await requireAdmin()
        const { id } = await context.params
        z.uuid().parse(id)
        return Response.json(
            { lead: await getAdminLead(id), mailDeliveryEnabled: mailDeliveryEnabled() },
            { headers: { 'Cache-Control': 'no-store' } },
        )
    } catch (error) {
        return apiError(error)
    }
}
export async function PATCH(request: Request, context: Context) {
    try {
        await requireAdmin(request)
        const { id } = await context.params
        z.uuid().parse(id)
        return Response.json(await updateAdminLead(id, await readJson(request)))
    } catch (error) {
        return apiError(error)
    }
}
export async function DELETE(request: Request, context: Context) {
    try {
        await requireAdmin(request)
        const { id } = await context.params
        z.uuid().parse(id)
        const result = await database().query('DELETE FROM leads WHERE id=$1', [id])
        if (!result.rowCount) throw new HttpError(404, 'Заявка не найдена')
        return Response.json({ ok: true })
    } catch (error) {
        return apiError(error)
    }
}
