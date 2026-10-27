export type CountryId = 'china' | 'japan' | 'korea' | 'europe'
export type CarStatus = 'draft' | 'published' | 'hidden'

export const COUNTRY_NAMES: Record<CountryId, string> = {
    china: 'Китай',
    japan: 'Япония',
    korea: 'Корея',
    europe: 'Европа',
}

export interface CountryRecord {
    id: CountryId
    name: string
}

export interface CarRecord {
    id: string
    country_id: CountryId
    brand: string
    model: string
    year: number
    category: string
    price: number
    equipment?: string
    images: string[]
    specs: {
        mileage: number
        engineVolume: number
        fuelType: string
        horsePower: number
        transmission: string
        driveType: string
        color?: string
        generation?: string
        features?: string[]
    }
    available: boolean
    created_at: string
    updated_at: string
}

export interface AdminCarRecord extends CarRecord {
    status: CarStatus
    version: number
}
