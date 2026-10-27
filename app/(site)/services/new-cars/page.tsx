import NewCarsPage from '@/components/templates/ServicesPage/NewCarsPage/NewCarsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Новые автомобили из Китая | Asia Motors',
    description:
        'Купите новый автомобиль из Китая с гарантией от Asia Motors. Прямые поставки от производителей, полное таможенное оформление и поддержка. Инновационные модели по доступным ценам.',
    keywords:
        'новые автомобили из Китая, китайские автомобили, купить новый автомобиль, BYD, Chery, Geely, Haval, электромобили из Китая',
    openGraph: {
        title: 'Новые автомобили из Китая | Asia Motors',
        description:
            'Откройте для себя будущее автомобильной индустрии с Asia Motors. Прямые поставки новых автомобилей из Китая с гарантией качества и полным сопровождением сделки.',
        type: 'website',
        url: 'https://asiamotors.su/services/new-cars',
        images: [
            {
                url: '/img/og-new-cars.jpg',
                width: 1200,
                height: 630,
                alt: 'Новые автомобили из Китая',
            },
        ],
    },
}

export default function NewCars() {
    return <NewCarsPage />
}
