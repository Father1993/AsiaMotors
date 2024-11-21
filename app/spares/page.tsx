/* eslint-disable max-len */
import { Metadata } from 'next'
import SparesPage from '@/components/templates/SparesPage/SparesPage'

export const metadata: Metadata = {
    title: 'Запчасти для китайских авто | Купить автозапчасти в Хабаровске | Asiamotors',
    description:
        'Оригинальные запчасти для китайских автомобилей Chery, Haval, Geely, Tank, Exeed, FAW, GWM. ✓ Гарантия качества ✓ Быстрая доставка ✓ Профессиональная консультация. Купить автозапчасти в Хабаровске с доставкой по России.',
    keywords:
        'запчасти китайских авто, автозапчасти хабаровск, запчасти chery, запчасти haval, запчасти geely, запчасти tank, запчасти exeed, запчасти faw, запчасти gwm, купить запчасти, заказать запчасти, заказать напрямую из Китая, запчасти для Китайцев, запчасти на китайца, запчасти из китая',
    alternates: {
        canonical: 'https://asiamotors.su/spares',
    },
    openGraph: {
        title: 'Запчасти для китайских авто | Купить автозапчасти в Хабаровске | Asiamotors',
        description:
            'Оригинальные запчасти для китайских автомобилей. Большой выбор автозапчастей для Chery, Haval, Geely, Tank, Exeed, FAW, GWM. Доставка по всей России. Гарантия качества от официального поставщика.',
        type: 'website',
        url: 'https://asiamotors.su/spares',
        siteName: 'Asiamotors',
        locale: 'ru_RU',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 192,
                height: 192,
                alt: 'Запчасти для китайских автомобилей Asiamotors',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Запчасти для китайских авто | Asiamotors',
        description:
            'Оригинальные запчасти для китайских автомобилей с доставкой по России. Большой выбор автозапчастей для Chery, Haval, Geely, Tank, Exeed, FAW, GWM.',
        images: '/img/android-chrome-192x192.png',
        site: '@asiamotors_su',
        creator: '@asiamotors_su',
    },
    category: 'auto parts',
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
}

export default function Spares() {
    return <SparesPage />
}
