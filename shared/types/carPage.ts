export interface CarSpecs {
    mileage: number
    engineVolume: number
    fuelType: string
    horsePower: number
    transmission: string
    driveType: string
}

export interface Car {
    id: string
    brand: string
    model: string
    year: number
    category: string
    price: number
    images: string[]
    specs: CarSpecs
    available: boolean
    createdAt: number
    updatedAt: number
}

export interface CarPageProps {
    car: Car
}
