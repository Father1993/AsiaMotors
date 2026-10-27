import { saveCar } from '@/shared/lib/server/cars'
import { requireAdmin, readJson, apiError } from '@/shared/lib/server/http'
export async function POST(request: Request) {
    try {
        await requireAdmin(request)
        return Response.json(await saveCar(await readJson(request)), {
            status: 201,
        })
    } catch (error) {
        return apiError(error)
    }
}
