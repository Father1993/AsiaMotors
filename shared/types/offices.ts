export type OfficeKey = 'khabarovsk' | 'vladivostok'

export interface Office {
    city: string
    address: string
    phone: string
    email: string
    workHours: string
    image: string
    mapComponent: 'khv' | 'vdk'
}

export type Offices = {
    [K in OfficeKey]: Office
}
