import { CountryId, Database } from './database.types'

export type Car = Database['public']['Tables']['cars']['Row']
export type Country = Database['public']['Tables']['countries']['Row']

export interface CarFormProps {
    car?: Car
    countries: Country[]
    onSubmit: () => void
    onClose: () => void
}

export type FormData = {
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
        color: string
        generation: string
        features: string[]
    }
    available: boolean
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const MAX_FILE_SIZE_MB = 10
