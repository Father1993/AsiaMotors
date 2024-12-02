/* eslint-disable @typescript-eslint/no-explicit-any */
import { carsData } from '@/shared/constants/catalog'

// Функция для создания slug
export function generateCarSlug(car: any) {
    return `${car.brand.toLowerCase()}-${car.model.toLowerCase()}-${
        car.id
    }`.replace(/\s+/g, '-')
}

// Функция для извлечения ID из slug
export function getIdFromSlug(slug: string) {
    const parts = slug.split('-')
    return parts[parts.length - 1]
}

// Функция поиска автомобиля
export async function findCarBySlug(slug: string) {
    const id = getIdFromSlug(slug)

    for (const countryData of Object.values(carsData)) {
        const car = countryData.find((car) => car.id === id)
        if (car) {
            const expectedSlug = generateCarSlug(car)
            if (slug === expectedSlug) {
                return car
            }
        }
    }
    return null
}

// Функция для безопасного получения данных автомобиля
export async function getCarData(params: { slug: string }) {
    const resolvedParams = params instanceof Promise ? await params : params
    return findCarBySlug(resolvedParams.slug)
}
