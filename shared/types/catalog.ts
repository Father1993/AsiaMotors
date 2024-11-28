import { ReactNode } from 'react'

export type CountryId = 'china' | 'japan' | 'korea' | 'europe'

export interface Country {
    id: CountryId
    name: string
}

export interface Car {
    id: number
    brand: string
    name: string
    category: string
    price: string
    oldPrice?: string
    image: string
    specs: Array<{
        icon: ReactNode
        value: string
    }>
    isNew?: boolean
    discount?: number
    available: boolean
}

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
