import type { CarStatus } from '@/shared/types/database.types'
export const carStatusLabels: Record<CarStatus, string> = {
    draft: 'Черновик',
    published: 'Опубликован',
    hidden: 'Скрыт',
}
export function CarStatusBadge({ status }: { status: CarStatus }) {
    return <span className={'admin-badge admin-badge-' + status}>{carStatusLabels[status]}</span>
}
