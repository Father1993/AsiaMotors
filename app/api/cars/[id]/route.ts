import { saveCar } from '@/shared/lib/server/cars'
import { database } from '@/shared/lib/server/db'
import {
    requireAdmin,
    readJson,
    apiError,
    HttpError,
} from '@/shared/lib/server/http'
import { z } from 'zod'
type Context = { params: Promise<{ id: string }> }
export async function PUT(request: Request, context: Context) {
    try {
        await requireAdmin(request)
        const { id } = await context.params
        return Response.json(await saveCar(await readJson(request), id))
    } catch (error) {
        return apiError(error)
    }
}
export async function DELETE(request: Request, context: Context) {
    try {
        await requireAdmin(request)
        const { id } = await context.params
        z.uuid().parse(id)
        const result = await database().query('DELETE FROM cars WHERE id=$1', [
            id,
        ])
        if (!result.rowCount) throw new HttpError(404, 'Автомобиль не найден')
        // Detached images are collected later, so a failed edit never destroys live media.
        return Response.json({ ok: true })
    } catch (error) {
        return apiError(error)
    }
}
