import { z } from 'zod'
const text = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .refine((v) => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v))
export { carInput, mediaPath } from '../car-schema'
export const formNames = [
    'Форма расчета стоимости',
    'Форма специального предложения',
    'Форма вопроса',
    'Форма заказа автомобиля',
    'Форма консультации',
    'Форма заказа запчастей',
] as const
export const leadInput = z.object({
    request_key: z.uuid(),
    consent: z.literal(true),
    consent_version: z.literal('2026-10-27'),
    website: z.string().max(200).optional(),
    form_name: z.enum(formNames),
    user_name: text(100).min(2),
    user_phone: text(40).refine((v) => {
        const n = v.replace(/\D/g, '')
        return /^[78]\d{10}$/.test(n)
    }),
    user_city: text(150).optional(),
    car_model: text(200).optional(),
    message: text(3000).optional(),
    car_year: text(10).optional(),
    vin_number: text(30).optional(),
    part_name: text(300).optional(),
    part_number: text(100).optional(),
})
