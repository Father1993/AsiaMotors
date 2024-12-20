import type { Metadata, Viewport } from 'next'
import PagesLayout from '@/components/layout/PageLayout'
import { LoadingProvider } from '@/components/provider/CustomProviderSpinner'
import ModalProvider from '@/components/provider/ModalProvider'
import './globalStyles/normalize.css'
import './globalStyles/globals.css'
import './globalStyles/popup.css'
import './globalStyles/cookie-popup.css'
import './globalStyles/posts.css'

export const metadata: Metadata = {
    metadataBase: new URL('https://asiamotors.su'),
    title: 'AsiaMotors — Продажа новых и БУ автомобилей из Китая | Надежные авто напрямую от поставщиков',
    description:
        'AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса. Полное сопровождение сделки, выгодные условия и прямые поставки. Откройте для себя лучшие авто из Китая с AsiaMotors и получите качественный сервис на каждом этапе покупки. Узнайте больше!',
    keywords:
        'автомобили из Китая, купить авто из Китая, новые автомобили из Китая, подержанные автомобили из Китая, продажа авто из Китая, авто из Китая для России, надежные авто из Китая, авто премиум-класса из Китая, китайские автомобили в России, поставки авто из Китая, заказать авто из Китая, китайские машины с доставкой, покупка авто из Китая, китайские кроссоверы и седаны, лучшие автомобили из Китая, авто под заказ, китаец под заказ, заказать китайца, китайские авто, дилер китайских авто, официально, официалы, купить машину, азиямоторс, азия-моторс, азия моторс, asiasmotors, asia-motors, asia motors',
    authors: [{ name: 'AsiaMotors' }],
    creator: 'Spinej Andrej',
    publisher: 'Spinej Andrej',
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
    manifest: '/manifest',
    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: 'https://asiamotors.su',
        siteName: 'AsiaMotors',
        title: 'AsiaMotors — Официальный импортер автомобилей из Китая',
        description:
            'Продажа и доставка новых и подержанных автомобилей из Китая. Официальная гарантия, выгодные цены, полное сопровождение сделки.',
        images: [
            {
                url: 'https://asiamotors.su/img/android-chrome-512x512.png',
                width: 512,
                height: 512,
                alt: 'AsiaMotors Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AsiaMotors -  ваш надежный выбор для покупки новых и подержанных автомобилей',
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
        google: 'NnSgHs5QovAAKDKnJdfPM1s_uKq5M_2N5jcweftHVlU',
        yandex: '9c844378ef09d23b',
    },
    other: {
        'zen-verification':
            'EsCGanIZ0BIFQzcVfextrP0Tug1kbszsqQzcylukgVWvnE45JF0KzZdouHqubwbf',
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
            <body suppressHydrationWarning>
                <PagesLayout>
                    <LoadingProvider>
                        <ModalProvider>{children}</ModalProvider>
                    </LoadingProvider>
                </PagesLayout>
            </body>
        </html>
    )
}
