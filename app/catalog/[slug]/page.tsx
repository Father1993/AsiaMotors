import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCarData } from '@/shared/utils/catalog'
import { carsData } from '@/shared/constants/catalog'
import { generateCarSlug } from '@/shared/utils/catalog'
import CarPageClient from '@/components/templates/CatalogPage/CarPage/CarPage.client'
import { PageProps } from '@/shared/types/common'

// Обновленная функция генерации метаданных
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    try {
        const car = await getCarData({ slug: props.params.slug })

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
                url: `https://asiamotors.su/catalog/${props.params.slug}`,
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
                canonical: `https://asiamotors.su/catalog/${props.params.slug}`,
                languages: {
                    'ru-RU': `https://asiamotors.su/catalog/${props.params.slug}`,
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

// Основной компонент страницы
export default async function CarDetailsPage(props: PageProps) {
    const car = await getCarData({ slug: props.params.slug })

    if (!car) {
        notFound()
    }

    return <CarPageClient car={car} />
}

// Генерация статических путей
export function generateStaticParams() {
    const allCars = Object.values(carsData).flat()
    return allCars.map((car) => ({
        slug: generateCarSlug(car),
    }))
}
