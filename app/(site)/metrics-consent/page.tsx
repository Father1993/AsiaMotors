/* eslint-disable max-len */
import { Metadata } from 'next'
import MetricsConsentPage from '@/components/templates/MetricsConsentPage/MetricsConsentPage'

export const metadata: Metadata = {
    title: 'Согласие на обработку данных метрическими программами | Asiamotors',
    description:
        'Информация о том, как Asiamotors использует метрические программы для анализа данных пользователей сайта и улучшения работы сервиса',
    openGraph: {
        title: 'Согласие на обработку данных метрическими программами | Asiamotors',
        description:
            'Узнайте, какие метрические программы используются на сайте Asiamotors, какие данные собираются и как можно отозвать согласие на их обработку',
        type: 'website',
        url: 'https://asiamotors.su/metrics-consent',
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
        title: 'Согласие на обработку данных метрическими программами | Asiamotors',
        description:
            'Информация о метрических программах, используемых на сайте Asiamotors, собираемых данных и способах отказа от их обработки',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/metrics-consent',
    },
}

export default function MetricsConsent() {
    return <MetricsConsentPage />
}
