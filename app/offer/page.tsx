/* eslint-disable max-len */
import { Metadata } from 'next'
import OfferPage from '@/components/templates/OfferPage/OfferPage'

export const metadata: Metadata = {
    title: 'Публичная оферта | Asiamotors',
    description:
        'Публичная оферта ООО "Азия Моторс". Условия продажи автомобилей, запасных частей и оказания сопутствующих услуг',
    openGraph: {
        title: 'Публичная оферта | Asiamotors',
        description:
            'Ознакомьтесь с условиями публичной оферты ООО "Азия Моторс". Подробная информация о правах и обязанностях сторон, порядке оказания услуг и условиях продажи автомобилей',
        type: 'website',
        url: 'https://asiamotors.su/offer',
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
        title: 'Публичная оферта | Asiamotors',
        description:
            'Юридическая информация и условия оказания услуг ООО "Азия Моторс". Права и обязанности сторон при приобретении автомобилей и сопутствующих услуг',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/offer',
    },
}

export default function Offer() {
    return <OfferPage />
}
