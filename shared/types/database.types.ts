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

type RecordMetadata = { id: string; created_at: string; updated_at: string }
export type CarRecord = import('../lib/car-schema').PublicCarData & RecordMetadata
export type AdminCarRecord = import('../lib/car-schema').CarData & RecordMetadata & { version: number }
