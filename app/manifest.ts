/* eslint-disable max-len */
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Perevozka27.ru',
        short_name: 'Perevozka27',
        description:
            'Быстрые и надежные грузоперевозки по Хабаровску и краю. Перевезем любой груз: от небольших посылок до крупногабаритных грузов. Гарантируем сохранность вашего имущества. Оперативная подача транспорта',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        lang: 'ru',
        display: 'standalone',
        icons: [
            {
                src: '/img/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/img/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                src: '/img/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/img/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {
                src: '/img/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/img/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
