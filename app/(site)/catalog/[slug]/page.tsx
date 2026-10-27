import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { generateCarSlug, carIdFromSlug } from '@/shared/utils/catalog'
import CarPageClient from '@/components/templates/CatalogPage/CarPage/CarPage.client'
import { listPublishedCars } from '@/shared/lib/server/catalog'
import { PageProps } from '@/shared/types/common'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Функция для безопасного получения slug
async function getSlug(params: PageProps['params']) {
    const resolvedParams = params instanceof Promise ? await params : params
    return resolvedParams.slug
}

async function getCarBySlug(slug: string) {
    const id = carIdFromSlug(slug)
    return id ? (await listPublishedCars()).find(car => car.id === id) || null : null
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    try {
        // Дожидаемся получения slug
        const slug = await getSlug(params)
        const car = await getCarBySlug(slug)

        if (!car) {
            return {
                title: 'Автомобиль не найден | AsiaMotors',
                description: 'Запрашиваемый автомобиль не найден в каталоге',
            }
        }

        const price = new Intl.NumberFormat('ru-RU').format(car.price)
        const carSlug = generateCarSlug(car)

        const createImageObject = (imageUrl: string) => ({
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${car.brand} ${car.model} ${car.year}`,
        })

        return {
            title: `${car.brand} ${car.model} ${car.year} купить в России | Цена ${price} ₽ | AsiaMotors`,
            description: `Купить ${car.brand} ${car.model} ${car.year} года в России. ✓ Цена ${price} ₽ ✓ Гарантия. Доставка по России.`,
            keywords: `${car.brand}, ${car.model}, купить ${car.brand} ${car.model}, цена ${car.brand} ${car.model}, ${car.category}, автомобили из китая`,
            openGraph: {
                title: `${car.brand} ${car.model} ${car.year} | AsiaMotors`,
                description: `${car.brand} ${car.model} ${car.year} года. Цена: ${price} ₽`,
                type: 'website',
                url: `https://asiamotors.su/catalog/${carSlug}`,
                images: [
                    createImageObject(car.images[0]),
                    ...car.images.slice(1).map(createImageObject),
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
                canonical: `https://asiamotors.su/catalog/${carSlug}`,
                languages: {
                    'ru-RU': `https://asiamotors.su/catalog/${carSlug}`,
                },
            },
        }
    } catch {
        return {
            title: 'Ошибка | AsiaMotors',
            description:
                'Произошла ошибка при загрузке информации об автомобиле',
        }
    }
}

export default async function CarPage({ params }: PageProps) {
    const slug = await getSlug(params)
    const allCars = await listPublishedCars()
    const car = allCars.find(car => car.id === carIdFromSlug(slug))

    if (!car || !allCars) {
        notFound()
    }

    if (slug !== generateCarSlug(car)) permanentRedirect('/catalog/' + generateCarSlug(car))

    return <CarPageClient car={car} allCars={allCars} />
}
