import UsedCarsPage from '@/components/templates/ServicesPage/UsedCarsPage/UsedCarsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Подержанные автомобили из Китая | Выгодные цены от Asia Motors',
    description:
        'Asia Motors предлагает проверенные подержанные автомобили из Китая. Экономия до 40%, полная диагностика, гарантия качества и быстрая доставка. Большой выбор моделей в отличном состоянии!',
    keywords:
        'подержанные автомобили из Китая, б/у авто из Китая, купить подержанный автомобиль, авто с пробегом, проверенные автомобили, доставка авто из Китая, Asia Motors',
    openGraph: {
        title: 'Подержанные автомобили из Китая | Asia Motors — надежность и выгода',
        description:
            'Широкий выбор подержанных автомобилей из Китая с гарантией технического состояния. Профессиональная диагностика, быстрая доставка и полное таможенное оформление от Asia Motors.',
        type: 'website',
        url: 'https://asiamotors.su/services/used-cars',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 1200,
                height: 630,
                alt: 'Подержанные автомобили из Китая Asia Motors',
            },
        ],
    },
}

export default function UsedCars() {
    return <UsedCarsPage />
}
