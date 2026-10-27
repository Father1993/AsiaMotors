/* eslint-disable max-len */
import { Metadata } from 'next'
import RecommendationsPage from '@/components/templates/RecommendationsPage/RecommendationsPage'

export const metadata: Metadata = {
    title: 'Информация об использовании рекомендательных технологий | Asiamotors',
    description:
        'Информация о рекомендательных технологиях, используемых на сайте Asiamotors для персонализации контента и улучшения пользовательского опыта',
    openGraph: {
        title: 'Информация о рекомендательных технологиях | Asiamotors',
        description:
            'Узнайте о том, какие рекомендательные технологии использует сайт Asiamotors, как они работают и как вы можете управлять их использованием',
        type: 'website',
        url: 'https://asiamotors.su/recommendations',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 192,
                height: 192,
                alt: 'Логотип Asiamotors',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'Информация о рекомендательных технологиях | Asiamotors',
        description:
            'Подробная информация о принципах работы рекомендательных систем на сайте Asiamotors и возможностях управления их использованием',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/recommendations',
    },
}

export default function Recommendations() {
    return <RecommendationsPage />
}
