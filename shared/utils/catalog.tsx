/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiClock, FiSettings, FiZap, FiDroplet } from 'react-icons/fi'
import { GiCarWheel, GiClockwiseRotation } from 'react-icons/gi'
import { TbAutomaticGearbox } from 'react-icons/tb'
import { supabase } from '../lib/superbase/client'

// Функция для создания slug
export const generateCarSlug = (car: any): string => {
    // Создаем slug из бренда, модели и года
    const slug = `${car.brand}-${car.model}-${car.year}`
        .toLowerCase()
        .replace(/\s+/g, '-') // заменяем пробелы на дефисы
        .replace(/[^a-z0-9-]/g, '') // удаляем все кроме букв, цифр и дефисов
        .replace(/-+/g, '-') // заменяем множественные дефисы на один
        .replace(/^-|-$/g, '') // удаляем дефисы в начале и конце

    return slug
}

// Функция для извлечения ID из slug
export function getIdFromSlug(slug: string) {
    const parts = slug.split('-')
    return parts[parts.length - 1]
}

// Функция поиска автомобиля
export async function findCarBySlug(slug: string) {
    try {
        const { data: cars, error } = await supabase.from('cars').select('*')

        if (error) {
            console.error('Error fetching cars:', error)
            return null
        }

        // Находим автомобиль по slug
        const car = cars.find((car) => {
            const expectedSlug = generateCarSlug(car)
            return slug === expectedSlug
        })

        return car || null
    } catch (error) {
        console.error('Error in findCarBySlug:', error)
        return null
    }
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
