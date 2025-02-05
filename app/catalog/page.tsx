import { Metadata } from 'next'
import CatalogPage from '@/components/templates/CatalogPage/CatalogPage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Каталог автомобилей из Китая | Новые авто 2024 | AsiaMotors',
    description:
        'Большой выбор новых автомобилей из Китая: кроссоверы, седаны, электромобили. Официальная гарантия, доставка по России, помощь в подборе авто. Актуальные цены и характеристики китайских автомобилей.',
    keywords:
        'китайские автомобили, авто из китая, купить китайский автомобиль, каталог китайских авто, новые автомобили 2024, кроссоверы из китая, цены на китайские авто',
    openGraph: {
        title: 'Каталог автомобилей из Китая | AsiaMotors',
        description:
            'Широкий выбор новых автомобилей из Китая от официального дилера. Гарантия качества, выгодные цены, полное сопровождение сделки.',
        type: 'website',
        url: 'https://asiamotors.su/catalog',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 192,
                height: 192,
                alt: 'Логотип Asiamotors',
            },
        ],
        siteName: 'AsiaMotors',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Каталог автомобилей из Китая | AsiaMotors',
        description:
            'Широкий выбор новых автомобилей из Китая. Официальная гарантия, доставка по России.',
        images: ['/img/catalog-preview.jpg'], // Убедитесь, что это изображение существует
        creator: '@AsiaMotors',
    },
    alternates: {
        canonical: 'https://asiamotors.su/catalog',
        languages: {
            'ru-RU': 'https://asiamotors.su/catalog',
        },
    },
}

export default function CatalogPages() {
    return <CatalogPage />
}
