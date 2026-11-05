export const CAR_AVAILABILITY = {
    in_stock: 'В наличии',
    in_china: 'В наличии в Китае',
    on_order: 'Под заказ',
} as const
export type CarAvailability = keyof typeof CAR_AVAILABILITY

// Accept old browser drafts without discarding any other entered fields.
export function withCarAvailability<T extends { availability?: CarAvailability; available?: boolean }>(value: T) {
    return { ...value, availability: value.availability ?? (value.available === false ? 'on_order' : 'in_stock') }
}
