import { listCars, listCountries } from '@/shared/lib/server/catalog'
import { apiError } from '@/shared/lib/server/http'
export const dynamic = 'force-dynamic'
export async function GET() {
    try {
        const [cars, countries] = await Promise.all([
            listCars(),
            listCountries(),
        ])
        return Response.json(
            { cars, countries },
            { headers: { 'Cache-Control': 'no-store' } }
        )
    } catch (error) {
        return apiError(error)
    }
}
