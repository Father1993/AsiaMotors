import { saveCar, getAdminCar, changeCarStatus, deleteCar } from '@/shared/lib/server/cars'
import { requireAdmin, readJson, apiError } from '@/shared/lib/server/http'
type Context = { params: Promise<{ id: string }> }
export async function GET(_request: Request, context: Context) {
    try { await requireAdmin(); return Response.json(await getAdminCar((await context.params).id)) }
    catch (error) { return apiError(error) }
}
export async function PUT(request: Request, context: Context) {
    try { await requireAdmin(request); return Response.json(await saveCar(await readJson(request), (await context.params).id)) }
    catch (error) { return apiError(error) }
}
export async function PATCH(request: Request, context: Context) {
    try { await requireAdmin(request); return Response.json(await changeCarStatus((await context.params).id, await readJson(request))) }
    catch (error) { return apiError(error) }
}
export async function DELETE(request: Request, context: Context) {
    try { await requireAdmin(request); return Response.json(await deleteCar((await context.params).id, await readJson(request))) }
    catch (error) { return apiError(error) }
}
