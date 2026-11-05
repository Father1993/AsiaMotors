import { BRAND_ICONS, BRAND_FAVICONS } from '@/shared/constants/branding'
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
                url: BRAND_ICONS.icon192,
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
        images: BRAND_ICONS.icon192,
    },
    icons: {
        icon: BRAND_FAVICONS,
        apple: BRAND_ICONS.apple,
    },
    alternates: {
        canonical: 'https://asiamotors.su/terms',
    },
}

export default function Terms() {
    return <TermsPage />
}
