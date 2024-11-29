/* eslint-disable max-len */
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'AsiaMotors',
        short_name: 'AsiaMotors',
        description:
            'AsiaMotors — специализированная платформа для продажи новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент качественных автомобилей, прямиком от производителей и проверенных поставщиков. AsiaMotors — надежный партнер для частных лиц и бизнеса, обеспечивающий прозрачные условия, выгодные цены и полное сопровождение на всех этапах покупки',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        lang: 'ru',
        display: 'standalone',
        icons: [
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
