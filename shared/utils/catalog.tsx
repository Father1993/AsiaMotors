/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiClock, FiSettings, FiZap, FiDroplet } from 'react-icons/fi'
import { GiCarWheel, GiClockwiseRotation } from 'react-icons/gi'

import { carsData } from '@/shared/constants/catalog'
import { TbAutomaticGearbox } from 'react-icons/tb'

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

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price)
}

export const specIcons = {
    mileage: <FiClock className="w-5 h-5 text-red-500" />,
    engineVolume: <FiSettings className="w-5 h-5 text-red-500" />,
    horsePower: <FiZap className="w-5 h-5 text-red-500" />,
    transmission: <TbAutomaticGearbox className="w-5 h-5 text-red-500" />,
    fuelType: <FiDroplet className="w-5 h-5 text-red-500" />,
    drive: <GiCarWheel className="w-5 h-5 text-red-500" />,
    year: <GiClockwiseRotation className="w-5 h-5 text-red-500" />,
}
