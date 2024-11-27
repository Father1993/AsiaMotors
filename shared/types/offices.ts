export type OfficeKey =
    | 'khabarovsk'
    | 'vladivostok'
    | 'kmch'
    | 'shl'
    | 'harbin'
    | 'suifenhe'

export interface Office {
    city: string
    address: string
    phone: string
    email: string
    workHours: string
    image: string
    mapComponent: 'khv' | 'vdk' | 'harbin' | 'shl' | 'kmch' | 'suifenhe'
}

export type Offices = {
    [K in OfficeKey]: Office
}

export interface TeamMember {
    name: string
    role: string
    image: string
    description: string | React.ReactElement
    telephone?: string | React.ReactElement
    address?: string
}
