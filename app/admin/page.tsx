import { Suspense } from 'react'
import { CarList } from '@/components/admin/CarList'
import { listCountries } from '@/shared/lib/server/catalog'
import { requireAdmin } from '@/shared/lib/server/http'

export default async function AdminPage() {
    await requireAdmin()
    const countries = await listCountries()
    return (
        <Suspense fallback={<p role="status">Загрузка каталога…</p>}>
            <CarList countries={countries} />
        </Suspense>
    )
}
