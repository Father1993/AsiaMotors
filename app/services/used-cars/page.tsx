import UsedCarsPage from '@/components/templates/ServicesPage/UsedCarsPage/UsedCarsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Новые автомобили из Китая | Качество и гарантия от Asia Motors',
    description:
        'Asia Motors предлагает новые автомобили из Китая по лучшим ценам. Проверенные модели, гарантия качества, таможенное оформление и доставка в кратчайшие сроки. Узнайте, почему нас выбирают клиенты по всему миру!',
    keywords:
        'новые автомобили из Китая, купить новый автомобиль, авто из Китая, проверенные китайские автомобили, доставка новых авто, надежные авто из Китая, гарантия качества, Asia Motors',
    openGraph: {
        title: 'Новые автомобили из Китая | Asia Motors — качество и гарантия',
        description:
            'Откройте для себя новые автомобили из Китая с гарантией качества от Asia Motors. Профессиональная доставка, таможенное оформление и лучшие цены. Подберите авто своей мечты уже сегодня!',
        type: 'website',
        url: 'https://asiamotors.su/services/',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 1200,
                height: 630,
                alt: 'Импорт автомобилей из Китая Азиамоторс',
            },
        ],
    },
}

export default function UsedCars() {
    return <UsedCarsPage />
}
