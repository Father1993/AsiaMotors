import { z } from 'zod'
const text = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .refine((v) => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v))
const short = text(150).min(1)
export const mediaPath = /^\/media\/[0-9a-f-]{36}\.webp$/
export const carInput = z.object({
    country_id: z.enum(['china', 'japan', 'korea', 'europe']),
    brand: short,
    model: short,
    year: z.number().int().min(1900).max(2200),
    category: short,
    price: z.number().finite().min(0).max(999999999999),
    equipment: text(3000).default(''),
    images: z.array(z.string().regex(mediaPath)).min(1).max(30),
    available: z.boolean(),
    specs: z.object({
        mileage: z.number().finite().min(0).max(1e8),
        engineVolume: z.number().finite().min(0).max(100),
        horsePower: z.number().finite().min(0).max(10000),
        fuelType: short,
        transmission: short,
        driveType: short,
        color: text(150).optional(),
        generation: text(150).optional(),
        features: z.array(text(300)).max(100).optional(),
    }),
})
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
