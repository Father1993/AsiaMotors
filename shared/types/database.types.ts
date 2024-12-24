export type CountryId = 'china' | 'japan' | 'korea' | 'europe'

export const COUNTRY_NAMES: Record<CountryId, string> = {
    china: 'Китай',
    japan: 'Япония',
    korea: 'Корея',
    europe: 'Европа',
}

export interface Database {
    public: {
        Tables: {
            countries: {
                Row: {
                    id: CountryId
                    name: string
                }
                Insert: {
                    id: CountryId
                    name: string
                }
                Update: {
                    id?: CountryId
                    name?: string
                }
            }
            cars: {
                Row: {
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
                Insert: Omit<
                    Database['public']['Tables']['cars']['Row'],
                    'id' | 'created_at' | 'updated_at'
                >
                Update: Partial<Database['public']['Tables']['cars']['Insert']>
            }
        }
    }
}
