import { PopularCarsEditor } from '@/components/admin/PopularCarsEditor'
import { requireAdmin } from '@/shared/lib/server/http'
import { listPopularCarChoices } from '@/shared/lib/server/popular-cars'

export default async function PopularCarsPage() {
    await requireAdmin()
    const cars = await listPopularCarChoices()
    return <PopularCarsEditor cars={cars} />
}
