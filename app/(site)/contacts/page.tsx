import { BRAND_ICONS, BRAND_FAVICONS } from '@/shared/constants/branding'
/* eslint-disable max-len */
import { Metadata } from 'next'
import ContactsPage from '@/components/templates/ContactsPage/ContactsPage'

export const metadata: Metadata = {
    title: 'Блог об автомобилях | Asiamotors',
    description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
    openGraph: {
        title: 'Блог об автомобилях | Asiamotors',
        description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
        type: 'website',
        url: 'https://asiamotors.su/blog',
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
        title: 'Блог об автомобилях | Asiamotors',
        description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
        images: BRAND_ICONS.icon192,
    },
    icons: {
        icon: BRAND_FAVICONS,
        apple: BRAND_ICONS.apple,
    },
}

export default function BlogPages() {
    return <ContactsPage />
}
