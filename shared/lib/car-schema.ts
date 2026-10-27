import { z } from 'zod'

const text = (max: number) => z.string('Заполните поле').trim()
    .max(max, `Не более ${max} символов`)
    .refine(value => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value), 'Недопустимые символы')
const required = text(150).min(1, 'Заполните поле')
const number = (max: number) => z.number('Введите число').finite('Введите конечное число')
    .min(0, 'Значение не может быть отрицательным').max(max, `Максимальное значение: ${max}`)
export const countrySchema = z.enum(['china', 'japan', 'korea', 'europe'], 'Выберите страну')
export const mediaPath = /^\/media\/[0-9a-f-]{36}\.webp$/
export const carStatusSchema = z.enum(['draft', 'published', 'hidden'])
export const carVersionSchema = z.number('Отсутствует версия записи').int('Некорректная версия записи').positive('Некорректная версия записи')
const specs = z.object({
    mileage: number(1e8), engineVolume: number(100), horsePower: number(10000),
    fuelType: required, transmission: required, driveType: required,
    color: text(150).optional(), generation: text(150).optional(),
    features: z.array(text(300)).max(100).optional(),
}, { error: 'Заполните характеристики' })
const fields = {
    country_id: countrySchema,
    brand: required, model: required,
    year: z.number('Введите год').int('Введите целый год').min(1900, 'Год от 1900').max(2200, 'Год до 2200'),
    category: required,
    price: number(999999999999), equipment: text(3000).default(''),
    images: z.array(z.string().regex(mediaPath, 'Загрузите фотографию заново'), { error: 'Добавьте фотографии' }).max(30, 'Не более 30 фотографий'),
    available: z.boolean().default(true), specs,
}
export const publicCarInput = z.object({ ...fields, images: fields.images.min(1, 'Добавьте хотя бы одну фотографию') })
const draft = z.object({
    ...fields,
    status: z.literal('draft'),
    country_id: countrySchema.nullable().default(null),
    year: fields.year.nullable().default(null), price: fields.price.nullable().default(null),
    category: text(150).default(''), images: fields.images.default([]),
    specs: specs.partial().default({}),
})
export const carInput = z.union([
    draft,
    publicCarInput.extend({ status: z.enum(['published', 'hidden']) }),
])
// Select the intended variant directly so field errors do not disappear inside a union issue.
export function parseCarInput(input: unknown) {
    const status = z.object({ status: carStatusSchema.default('draft') }).parse(input).status
    return status === 'draft'
        ? draft.parse({ ...Object(input), status })
        : publicCarInput.extend({ status: z.enum(['published', 'hidden']) }).parse(input)
}
export type CarData = z.infer<typeof carInput>
export type PublicCarData = z.infer<typeof publicCarInput>
