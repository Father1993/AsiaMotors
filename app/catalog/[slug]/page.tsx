/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { carsData } from '@/shared/constants/catalog'
import { notFound } from 'next/navigation'
import CarPage from '@/components/templates/CatalogPage/CarPage/CarPage'

// Функция для создания slug
export function generateCarSlug(car: any) {
    return `${car.brand.toLowerCase()}-${car.model.toLowerCase()}-${
        car.id
    }`.replace(/\s+/g, '-')
}

// Функция для извлечения ID из slug
function getIdFromSlug(slug: string) {
    const parts = slug.split('-')
    return parts[parts.length - 1]
}

// Функция поиска автомобиля
async function findCarBySlug(slug: string) {
    const id = getIdFromSlug(slug)

    for (const countryData of Object.values(carsData)) {
        const car = countryData.find((car) => car.id === id)
        if (car) {
            const expectedSlug = generateCarSlug(car)
            if (slug === expectedSlug) {
                return car
            }
        }
    }
    return null
}

// Генерация метаданных
export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const car = await findCarBySlug(params.slug)

    if (!car) {
        return {
            title: 'Автомобиль не найден | AsiaMotors',
            description:
                'Запрашиваемый автомобиль не найден в каталоге AsiaMotors',
        }
    }

    const price = new Intl.NumberFormat('ru-RU').format(car.price)

    return {
        title: `${car.brand} ${car.model} ${car.year} купить в России | Цена ${price} ₽ | AsiaMotors`,
        description: `Купить ${car.brand} ${car.model} ${car.year} года в России. ✓ Цена ${price} ₽ ✓ ${car.specs.engineVolume}л ✓ ${car.specs.horsePower} л.с. ✓ ${car.specs.transmission} ✓ Официальная гарантия. Доставка по России.`,
        keywords: `${car.brand}, ${car.model}, купить ${car.brand} ${car.model}, цена ${car.brand} ${car.model}, ${car.category}, автомобили из китая`,

        openGraph: {
            title: `${car.brand} ${car.model} ${car.year} | AsiaMotors`,
            description: `${car.brand} ${car.model} ${car.year} года, ${car.specs.engineVolume}л, ${car.specs.horsePower} л.с., ${car.specs.transmission}. Цена: ${price} ₽`,
            type: 'website',
            url: `https://asiamotors.su/catalog/${params.slug}`,
            images: [
                {
                    url: car.images[0],
                    width: 1200,
                    height: 630,
                    alt: `${car.brand} ${car.model} ${car.year}`,
                },
                ...car.images.slice(1).map((img) => ({
                    url: img,
                    width: 1200,
                    height: 630,
                    alt: `${car.brand} ${car.model} ${car.year}`,
                })),
            ],
            siteName: 'AsiaMotors',
        },

        twitter: {
            card: 'summary_large_image',
            title: `${car.brand} ${car.model} ${car.year} | AsiaMotors`,
            description: `${car.brand} ${car.model} ${car.year} года, ${car.specs.engineVolume}л, ${car.specs.horsePower} л.с. Цена: ${price} ₽`,
            images: [car.images[0]],
            creator: '@AndrejDev',
        },

        alternates: {
            canonical: `https://asiamotors.su/catalog/${params.slug}`,
            languages: {
                'ru-RU': `https://asiamotors.su/catalog/${params.slug}`,
            },
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
            },
        },
    }
}

// Генерация статических путей
export async function generateStaticParams() {
    const allCars = Object.values(carsData).flat()
    return allCars.map((car) => ({
        slug: generateCarSlug(car),
    }))
}

// Основной компонент страницы
export default async function CarDetailsPage({
    params,
}: {
    params: { slug: string }
}) {
    const car = await findCarBySlug(params.slug)

    if (!car) {
        notFound()
    }

    return <CarPage car={car} />
}
