import { companyExperience } from '@/shared/constants/company'

export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import AboutPages from '@/components/templates/AboutPage/AboutPage'

export const metadata: Metadata = {
    title: 'Asia Motors - Профессиональный импорт автомобилей из Китая | Официальный импортер',
    description:
        'Официальный импортер китайских автомобилей премиум-класса. Прямые поставки от производителей, собственные офисы в Китае, полное таможенное оформление и гарантийное обслуживание. Экономия до 30% от рыночной цены.',
    keywords:
        'импорт авто из Китая, китайские автомобили премиум-класса, EXEED, ZEEKR, LI Auto, международная логистика, автомобильный импорт, таможенное оформление авто, гарантия на китайские авто',
    openGraph: {
        title: 'Asia Motors - Ваш надежный партнер в мире премиальных китайских автомобилей',
        description:
            'Профессиональный импорт автомобилей с гарантией качества и безопасности. Собственные офисы в Китае, прямые контракты с производителями, полный цикл сопровождения сделки.',
        type: 'website',
        images: [
            {
                url: '/img/about-delivery-map.webp',
                width: 1672,
                height: 941,
                alt: 'Карта маршрутов доставки Asia Motors',
            },
        ],
    },
}

export default function AboutPage() {
    return <AboutPages experience={companyExperience()} />
}
