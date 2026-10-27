/* eslint-disable max-len */
import { Metadata } from 'next'
import ConsentPage from '@/components/templates/ConsentPage/ConsentPage'

export const metadata: Metadata = {
    title: 'Согласие на обработку персональных данных | Asiamotors',
    description:
        'Согласие на обработку персональных данных пользователей сайта Asiamotors. Информация о том, как мы обрабатываем и защищаем ваши данные.',
    openGraph: {
        title: 'Согласие на обработку персональных данных | Asiamotors',
        description:
            'Согласие на обработку персональных данных пользователей сайта Asiamotors. Информация о сборе, использовании и защите ваших персональных данных.',
        type: 'website',
        url: 'https://asiamotors.su/consent',
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
        title: 'Согласие на обработку персональных данных | Asiamotors',
        description:
            'Информация о том, как Asiamotors обрабатывает и защищает персональные данные пользователей в соответствии с законодательством РФ.',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/consent',
    },
}

export default function Consent() {
    return <ConsentPage />
}
