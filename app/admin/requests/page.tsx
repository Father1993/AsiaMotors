import { Suspense } from 'react'
import { requireAdmin } from '@/shared/lib/server/http'
import { LeadList } from '@/components/admin/LeadList'
export const metadata = { title: 'Заявки | AsiaMotors' }
export default async function Requests() {
    await requireAdmin()
    return (
        <Suspense fallback={<p role="status">Загрузка заявок…</p>}>
            <LeadList />
        </Suspense>
    )
}
