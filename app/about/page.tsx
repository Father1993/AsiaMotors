import { Metadata } from 'next'
import AboutPages from '@/components/templates/AboutPage/AboutPage'

export const metadata: Metadata = {
    title: 'AsiaMotors - Профессиональный импорт автомобилей из Китая',
    description:
        'Ведущий эксперт по импорту качественных автомобилей из Китая. Надежность, прозрачность и индивидуальный подход к каждому клиенту.',
    keywords:
        'импорт авто из Китая, китайские автомобили, международная логистика, автомобильный трейдинг',
    openGraph: {
        title: 'AsiaMotors - Ваш надежный партнер в мире китайских автомобилей',
        description:
            'Профессиональный импорт автомобилей с гарантией качества и безопасности',
        type: 'website',
        images: [
            {
                url: '/img/about-hero.jpg',
                width: 1200,
                height: 630,
            },
        ],
    },
}

export default function AboutPage() {
    return <AboutPages />
}
