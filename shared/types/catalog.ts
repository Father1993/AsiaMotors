export type CountryId = 'china' | 'japan' | 'korea' | 'europe'

export interface Country {
    id: CountryId
    name: string
}

export interface Car {
    id: string // Используем string для Firebase ID
    brand: string
    model: string
    year: number
    price: number // Храним как число для удобства фильтрации
    specs: {
        color?: string
        generation?: string
        features?: string[]
        mileage: number
        engineVolume: number
        fuelType: string
        horsePower: number
        transmission: string
        driveType: string
    }

    category: string
    images: string[]
    available: boolean
    discount?: boolean
    equipment?: string
    createdAt: number // Timestamp для сортировки
    updatedAt: number
    seo?: {
        title?: string
        description?: string
        keywords?: string[]
        slug?: string
        metaImage?: string
        alternativeText?: string
        specifications?: {
            manufacturer?: string
            modelYear?: number
            bodyType?: string
            fuelConsumption?: string
            acceleration?: string
            maxSpeed?: string
        }
    }
}

// Справочники для фильтров
export const fuelTypes = ['Бензин', 'Дизель', 'Гибрид', 'Электро'] as const

export const driveTypes = ['Передний', 'Задний', 'Полный'] as const

export const transmissionTypes = ['МКПП', 'АКПП', 'Робот', 'Вариатор'] as const

export const categories = [
    'Все',
    'Кроссоверы',
    'Седаны',
    'Электромобили',
    'Минивэны',
    'Универсалы',
    'Джип',
] as const

export type CarsDataType = {
    [key in CountryId]: Car[]
}

export interface CarCardProps {
    car: Car
    viewMode: 'grid' | 'list'
}

export interface PageProps {
    params: {
        slug: string
    }
}

export type PageParams = {
    params: {
        slug: string
    }
    searchParams?: { [key: string]: string | string[] | undefined }
}
