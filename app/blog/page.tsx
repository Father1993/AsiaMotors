/* eslint-disable max-len */
import { Metadata } from 'next'
import BlogPage from '@/components/templates/BlogPage/BlogPage'

export const metadata: Metadata = {
    title: 'Политика конфиденциальности | Asiamotors',
    description:
        'Ознакомьтесь с политикой конфиденциальности Asiamotors. Мы заботимся о защите ваших персональных данных и обеспечиваем прозрачность в обработке информации наших клиентов',
    openGraph: {
        title: 'Политика конфиденциальности Asiamotors | Защита ваших данных',
        description:
            'Узнайте, как AsiaMotors обеспечивает безопасность ваших персональных данных. Наша политика конфиденциальности гарантирует прозрачность и надежность в обработке информации.',
        type: 'website',
        url: 'https://asiamotors.su/privacy-policy',
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
        title: 'Политика конфиденциальности Asiamotors | Ваши данные под защитой',
        description:
            'Asiamotors гарантирует безопасность ваших персональных данных. Ознакомьтесь с нашей политикой конфиденциальности для полной информации',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/privacy-policy',
    },
}

export default function PersonalDataPolicy() {
    return <BlogPage />
}
