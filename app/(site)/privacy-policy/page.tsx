import { BRAND_ICONS, BRAND_FAVICONS } from '@/shared/constants/branding'
/* eslint-disable max-len */
import { Metadata } from 'next'
import PrivacyPolicyPage from '@/components/templates/PrivacyPolicyPage/PrivacyPolicyPage'

export const metadata: Metadata = {
    title: 'Политика использования файлов cookie | Asiamotors',
    description:
        'Узнайте, как Asiamotors использует файлы cookie для улучшения работы сайта. Информация о типах cookie-файлов, их назначении и управлении ими',
    openGraph: {
        title: 'Политика использования файлов cookie | Asiamotors',
        description:
            'Узнайте, как Asiamotors использует файлы cookie для улучшения вашего опыта использования сайта. Информация о настройках и управлении cookie-файлами',
        type: 'website',
        url: 'https://asiamotors.su/cookie-policy',
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
        title: 'Политика cookie-файлов Asiamotors | Прозрачность и контроль',
        description:
            'Информация об использовании cookie-файлов на сайте Asiamotors. Узнайте, как управлять настройками cookie для комфортного использования сайта',
        images: BRAND_ICONS.icon192,
    },
    icons: {
        icon: BRAND_FAVICONS,
        apple: BRAND_ICONS.apple,
    },
    alternates: {
        canonical: 'https://asiamotors.su/privacy-policy',
    },
}

export default function PersonalDataPolicy() {
    return <PrivacyPolicyPage />
}
