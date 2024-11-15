/* eslint-disable max-len */
import type { Metadata, Viewport } from 'next'
import PagesLayout from '@/components/layout/PageLayout'
import './globalStyles/normalize.css'
import './globalStyles/globals.css'
import './globalStyles/cookie-popup.css'
import { LoadingProvider } from '@/components/provider/CustomProviderSpinner'

export const metadata: Metadata = {
    metadataBase: new URL('https://asiamotors.su'),
    title: 'AsiaMotors — Продажа новых и БУ автомобилей из Китая | Надежные авто напрямую от поставщиков',
    description:
        'AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса. Полное сопровождение сделки, выгодные условия и прямые поставки. Откройте для себя лучшие авто из Китая с AsiaMotors и получите качественный сервис на каждом этапе покупки. Узнайте больше!',
    keywords:
        'автомобили из Китая, купить авто из Китая, новые автомобили из Китая, подержанные автомобили из Китая, продажа авто из Китая, авто из Китая для России, надежные авто из Китая, авто премиум-класса из Китая, китайские автомобили в России, поставки авто из Китая, заказать авто из Китая, китайские машины с доставкой, покупка авто из Китая, китайские кроссоверы и седаны, лучшие автомобили из Китая, авто под заказ, китаец под заказ, заказать китайца, китайские авто, дилер китайских авто, официально, официалы, купить машину, азиамоторс, азиа-моторс, азиа моторс, asiasmotors, asia-motors, asia motors',
    authors: [{ name: 'AsiaMotors' }],
    creator: 'AsiaMotors',
    publisher: 'AsiaMotors',
    formatDetection: {
        telephone: true,
        date: false,
        address: true,
        email: true,
    },
    icons: {
        icon: [
            { url: '/img/favicon.ico', sizes: 'any' },
            {
                url: '/img/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                url: '/img/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
        ],
        apple: [{ url: '/img/apple-touch-icon.png', sizes: '180x180' }],
        other: [{ rel: 'mask-icon', url: '/img/logo-s.svg', color: '#5bbad5' }],
    },
    manifest: '/manifest.json',
    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: 'https://asiamotors.su',
        siteName: 'AsiaMotors',
        title: 'AsiaMotors — Продажа новых и БУ автомобилей из Китая | Надежные авто напрямую от поставщиков',
        description:
            'AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса. Полное сопровождение сделки, выгодные условия и прямые поставки. Откройте для себя лучшие авто из Китая с AsiaMotors и получите качественный сервис на каждом этапе покупки. Узнайте больше!',
        images: [
            {
                url: '/img/android-chrome-512x512.png',
                alt: 'AsiaMotors - Любые автомобили из Китая | Новые и Б/У',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AsiaMotors - Лучшие грузоперевозки в Хабаровске',
        description:
            'AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса. Полное сопровождение сделки, выгодные условия и прямые поставки. Откройте для себя лучшие авто из Китая с AsiaMotors и получите качественный сервис на каждом этапе покупки. Узнайте больше!',
        images: ['/img/android-chrome-192x192.png'],
        creator: '@AsiaMotors',
    },
    alternates: {
        canonical: 'https://asiamotors.su',
        languages: {
            'ru-RU': 'https://asiamotors.su',
        },
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: '',
        yandex: '',
    },
}

export const viewport: Viewport = {
    themeColor: 'white',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru">
            <head />
            <body>
                <PagesLayout>
                    <LoadingProvider>{children}</LoadingProvider>
                </PagesLayout>
            </body>
        </html>
    )
}
