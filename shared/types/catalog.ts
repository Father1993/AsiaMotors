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
