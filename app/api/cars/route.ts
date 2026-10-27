import { saveCar } from '@/shared/lib/server/cars'
import { listAdminCars } from '@/shared/lib/server/catalog'
import { requireAdmin, readJson, apiError } from '@/shared/lib/server/http'
export async function GET(request: Request) {
    try {
        await requireAdmin()
        return Response.json(await listAdminCars(new URL(request.url).searchParams))
    } catch (error) { return apiError(error) }
}
export async function POST(request: Request) {
    try {
        await requireAdmin(request)
        return Response.json(await saveCar(await readJson(request)), { status: 201 })
    } catch (error) { return apiError(error) }
}
