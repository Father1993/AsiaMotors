export type CountryId = 'china' | 'japan' | 'korea'

export interface Country {
    id: CountryId
    name: string
}

export interface CarData {
    id: number
    name: string
    category: string
    price: string
    image: string
    specs: string[]
    available: boolean
}

export interface CarsDataType {
    [key: string]: CarData[]
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
        icon: React.ReactNode
        value: string
    }>
    isNew?: boolean
    discount?: number
    available: boolean
}

export interface PageProps {
    params: {
        slug: string
    }
}
