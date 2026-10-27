import type { CarRecord } from '@/shared/types/database.types'
import { FiClock, FiSettings, FiZap, FiDroplet } from 'react-icons/fi'
import { GiCarWheel, GiClockwiseRotation } from 'react-icons/gi'
import { TbAutomaticGearbox } from 'react-icons/tb'

// Функция для создания slug
export const generateCarSlug = (
    car: Pick<CarRecord, 'id' | 'brand' | 'model' | 'year'>
): string => {
    // Создаем slug из бренда, модели и года
    const slug = `${car.brand}-${car.model}-${car.year}`
        .toLowerCase()
        .replace(/\s+/g, '-') // заменяем пробелы на дефисы
        .replace(/[^a-z0-9-]/g, '') // удаляем все кроме букв, цифр и дефисов
        .replace(/-+/g, '-') // заменяем множественные дефисы на один
        .replace(/^-|-$/g, '') // удаляем дефисы в начале и конце

    return `${slug}-${car.id}`
}

export const carIdFromSlug = (slug: string): string | null =>
    slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i)?.[1].toLowerCase() || null

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
