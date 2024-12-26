import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import toast from 'react-hot-toast'
import { generateCarSlug } from '@/shared/utils/catalog'
import CarPageClient from '@/components/templates/CatalogPage/CarPage/CarPage.client'
import { supabase } from '@/shared/lib/superbase/client'

interface Props {
    params: Promise<{ slug: string }> | { slug: string }
}

// Функция для получения автомобиля по slug
async function getCarBySlug(slug: string) {
    try {
        // Получаем все автомобили
        const { data: cars, error } = await supabase.from('cars').select('*')

        if (error) {
            toast.error('Ошибка получения данных автомобиля')
            return null
        }

        return cars.find((car) => generateCarSlug(car) === slug) || null
    } catch {
        toast.error('Ошибка получения данных автомобиля')
        return null
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // Получаем slug из params
    const resolvedParams = await Promise.resolve(params)
    const car = await getCarBySlug(resolvedParams.slug)

    if (!car) {
        return {
            title: 'Автомобиль не найден | AsiaMotors',
            description: 'Запрашиваемый автомобиль не найден в каталоге',
        }
    }

    try {
        if (!car) {
            return {
                title: 'Автомобиль не найден | AsiaMotors',
                description: 'Запрашиваемый автомобиль не найден в каталоге',
            }
        }

        const price = new Intl.NumberFormat('ru-RU').format(car.price)
        const slug = generateCarSlug(car)

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
                url: `https://asiamotors.su/catalog/${slug}`,
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
                canonical: `https://asiamotors.su/catalog/${slug}`,
                languages: {
                    'ru-RU': `https://asiamotors.su/catalog/${slug}`,
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

export default async function CarPage({ params }: Props) {
    // Получаем slug из params
    const resolvedParams = await Promise.resolve(params)
    const car = await getCarBySlug(resolvedParams.slug)

    if (!car) {
        notFound()
    }

    return <CarPageClient car={car} />
}

// Генерация статических путей остается без изменений
export async function generateStaticParams() {
    const { data: cars } = await supabase.from('cars').select('*')

    return (cars || []).map((car) => ({
        slug: generateCarSlug(car),
    }))
}
