import {
    CAR_AVAILABILITY,
    type CarAvailability as Availability,
} from '@/shared/constants/carAvailability'

const colors: Record<Availability, string> = {
    in_stock: 'bg-green-100 text-green-800',
    in_china: 'bg-blue-100 text-blue-800',
    on_order: 'bg-gray-100 text-gray-700',
}
export function CarAvailability({ value }: { value: Availability }) {
    return (
        <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${colors[value]}`}
        >
            {CAR_AVAILABILITY[value]}
        </span>
    )
}
