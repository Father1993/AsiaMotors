import { BRAND_ICONS } from '@/shared/constants/branding'
import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
    return {
        id: '/',
        name: 'AsiaMotors — автомобили',
        short_name: 'AsiaMotors',
        description: 'Автомобили из Китая: каталог, подбор и полезные статьи',
        start_url: '/',
        scope: '/',
        lang: 'ru',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: BRAND_ICONS.icon192,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: BRAND_ICONS.icon512,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}
