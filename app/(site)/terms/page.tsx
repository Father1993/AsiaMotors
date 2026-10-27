/* eslint-disable max-len */
import { Metadata } from 'next'
import TermsPage from '@/components/templates/TermsPage/TermsPage'

export const metadata: Metadata = {
    title: 'Пользовательское соглашение | Asiamotors',
    description:
        'Пользовательское соглашение сайта Asiamotors. Условия использования сайта, права и обязанности пользователей, ответственность сторон.',
    openGraph: {
        title: 'Пользовательское соглашение | Asiamotors',
        description:
            'Пользовательское соглашение сайта Asiamotors. Ознакомьтесь с условиями использования нашего сайта и услуг.',
        type: 'website',
        url: 'https://asiamotors.su/terms',
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
        title: 'Пользовательское соглашение Asiamotors',
        description:
            'Условия использования сайта Asiamotors. Ознакомьтесь с правами и обязанностями пользователей нашего сайта.',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/terms',
    },
}

export default function Terms() {
    return <TermsPage />
}
