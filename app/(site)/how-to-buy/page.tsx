import { Metadata } from 'next'
import HowToBuyPages from '@/components/templates/HowToBuyPage/HowToBuyPage'

export const metadata: Metadata = {
    title: 'Как купить автомобиль из Китая | Подробное руководство | AsiaMotors',
    description:
        'Простой и безопасный процесс покупки автомобиля из Китая. Профессиональная помощь, гарантии качества, прозрачная схема работы. Узнайте все о международной автомобильной логистике.',
    keywords:
        'покупка авто из Китая, импорт автомобилей, китайские автомобили, международная логистика, автомобильный трейдинг',
    openGraph: {
        title: 'Как купить автомобиль из Китая | AsiaMotors',
        description:
            'Профессиональный гид по покупке автомобиля из Китая. Безопасно, выгодно, прозрачно.',
        type: 'website',
        url: 'https://asiamotors.su/how-to-buy',
        images: [
            {
                url: '/img/how-buy/tank-road.webp',
                width: 1671,
                height: 941,
                alt: 'Внедорожник TANK на лесной дороге',
            },
        ],
    },
}

export default function HowToBuyPage() {
    return <HowToBuyPages />
}
