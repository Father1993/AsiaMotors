/* eslint-disable max-len */
import { Metadata } from 'next'
import MarketingConsentPage from '@/components/templates/MarketingConsentPage/MarketingConsentPage'

export const metadata: Metadata = {
    title: 'Согласие на получение рекламной рассылки | Asiamotors',
    description:
        'Информация об условиях рекламной рассылки от Asiamotors, содержании и частоте рассылки, а также о способах отказа от неё',
    openGraph: {
        title: 'Согласие на получение рекламной рассылки | Asiamotors',
        description:
            'Ознакомьтесь с условиями рекламной рассылки от Asiamotors. Информация о содержании, частоте и способах управления рекламными сообщениями',
        type: 'website',
        url: 'https://asiamotors.su/marketing-consent',
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
        title: 'Согласие на получение рекламной рассылки | Asiamotors',
        description:
            'Информация о рекламной рассылке от Asiamotors: содержание, частота, способы отписки и другие важные условия',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/marketing-consent',
    },
}

export default function MarketingConsent() {
    return <MarketingConsentPage />
}
