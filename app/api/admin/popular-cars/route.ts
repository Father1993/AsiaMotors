import { apiError, readJson, requireAdmin } from '@/shared/lib/server/http'
import { savePopularCars } from '@/shared/lib/server/popular-cars'

export async function PUT(request: Request) {
    try {
        await requireAdmin(request)
        await savePopularCars(await readJson(request))
        return Response.json({ ok: true })
    } catch (error) {
        return apiError(error)
    }
}
