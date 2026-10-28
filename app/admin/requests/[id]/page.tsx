import { notFound } from 'next/navigation'
import { z } from 'zod'
import { requireAdmin, HttpError } from '@/shared/lib/server/http'
import { getAdminLead, mailDeliveryEnabled } from '@/shared/lib/server/leads'
import { adminReturnTo } from '@/shared/lib/admin-navigation'
import { LeadDetail } from '@/components/admin/LeadDetail'
export const metadata = { title: 'Заявка | AsiaMotors' }
export default async function RequestPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ returnTo?: string }>
}) {
    await requireAdmin()
    const { id } = await params
    if (!z.uuid().safeParse(id).success) notFound()
    const lead = await getAdminLead(id).catch((error) => {
        if (error instanceof HttpError && error.status === 404) notFound()
        throw error
    })
    return (
        <LeadDetail
            key={id}
            initial={lead}
            mailDeliveryEnabled={mailDeliveryEnabled()}
            returnTo={adminReturnTo((await searchParams).returnTo, '/admin/requests')}
        />
    )
}
