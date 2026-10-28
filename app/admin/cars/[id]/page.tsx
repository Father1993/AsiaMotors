import { notFound } from 'next/navigation'
import { z } from 'zod'
import { CarEditor } from '@/components/admin/CarEditor'
import { getAdminCar } from '@/shared/lib/server/cars'
import { HttpError, requireAdmin } from '@/shared/lib/server/http'
import { listCountries } from '@/shared/lib/server/catalog'
import { adminReturnTo } from '@/shared/lib/admin-navigation'
export default async function EditCar({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ returnTo?: string }>
}) {
    await requireAdmin()
    const { id } = await params
    if (!z.uuid().safeParse(id).success) notFound()
    const car = await getAdminCar(id).catch((error) => {
        if (error instanceof HttpError && error.status === 404) notFound()
        throw error
    })
    return (
        <CarEditor
            key={id}
            car={car}
            countries={await listCountries()}
            returnTo={adminReturnTo((await searchParams).returnTo)}
        />
    )
}
