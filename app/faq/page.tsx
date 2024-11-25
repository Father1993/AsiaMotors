/* eslint-disable max-len */
import { Metadata } from 'next'
import FAQ from '@/components/features/Faq/FAQ'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { FAQ as BreadcrumbsFAQ } from '@/shared/constants/breadcrumbs'

export const metadata: Metadata = {
    title: 'Часто задаваемые вопросы (FAQ) | AsiaMotors - автомобили из Китая',
    description:
        'Ответы на популярные вопросы о покупке, доставке и обслуживании китайских автомобилей. Узнайте больше о гарантии, сервисе и условиях работы компании AsiaMotors.',
    openGraph: {
        title: 'Часто задаваемые вопросы (FAQ) | AsiaMotors - автомобили из Китая',
        description:
            'Ответы на популярные вопросы о покупке, доставке и обслуживании китайских автомобилей. Узнайте больше о гарантии, сервисе и условиях работы компании AsiaMotors.',
        type: 'website',
        url: 'https://asiamotors.su/faq',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 192,
                height: 192,
                alt: 'AsiaMotors - официальный дилер китайских автомобилей',
            },
        ],
        siteName: 'AsiaMotors',
        locale: 'ru_RU',
    },
    twitter: {
        card: 'summary',
        title: 'FAQ | AsiaMotors - ответы на вопросы о китайских автомобилях',
        description:
            'Ответы на популярные вопросы о покупке, доставке и обслуживании китайских автомобилей от официального дилера AsiaMotors.',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/faq',
    },
}

export default function BlogPages() {
    return (
        <>
            <div className="container">
                <Breadcrumbs items={BreadcrumbsFAQ} />
            </div>
            <FAQ />
        </>
    )
}
