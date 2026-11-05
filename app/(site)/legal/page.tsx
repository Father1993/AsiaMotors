import { BRAND_ICONS, BRAND_FAVICONS } from '@/shared/constants/branding'
/* eslint-disable max-len */
import { Metadata } from 'next'
import LegalPage from '@/components/templates/LegalPage/LegalPage'

export const metadata: Metadata = {
    title: 'Правовая информация | Asiamotors',
    description:
        'Правовая информация компании Asiamotors. Пользовательское соглашение, политика конфиденциальности, публичная оферта и другие юридические документы.',
    openGraph: {
        title: 'Правовая информация | Asiamotors',
        description:
            'Правовая информация и юридические документы компании Asiamotors.',
        type: 'website',
        url: 'https://asiamotors.su/legal',
        images: [
            {
                url: BRAND_ICONS.icon192,
                width: 192,
                height: 192,
                alt: 'Логотип Asiamotors',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'Правовая информация Asiamotors',
        description:
            'Правовая информация и юридические документы компании Asiamotors. Соглашения, политики и согласия.',
        images: BRAND_ICONS.icon192,
    },
    icons: {
        icon: BRAND_FAVICONS,
        apple: BRAND_ICONS.apple,
    },
    alternates: {
        canonical: 'https://asiamotors.su/legal',
    },
}

export default function Legal() {
    return <LegalPage />
}
