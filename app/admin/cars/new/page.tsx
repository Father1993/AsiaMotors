import { CarEditor } from '@/components/admin/CarEditor'
import { requireAdmin } from '@/shared/lib/server/http'
import { listCountries } from '@/shared/lib/server/catalog'
import { adminReturnTo } from '@/shared/lib/admin-navigation'
export default async function NewCar({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
    await requireAdmin()
    return (
        <CarEditor
            countries={await listCountries()}
            returnTo={adminReturnTo((await searchParams).returnTo)}
        />
    )
}
