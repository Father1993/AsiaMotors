export interface Post {
    slug: string
    publishedAt: string
    title: string
    coverImage: string
    content: string
    category: string
}

export interface Car {
    slug: string
    updatedAt: string
    brand: string
    model: string
    year: number
    price: number
    description: string
    mainImage: string
    images: Array<{
        url: string
        caption?: string
    }>
    engineVolume: string
    horsePower: number
    transmission: string
    drive: string
    mileage: number
    fuelType: string
}
