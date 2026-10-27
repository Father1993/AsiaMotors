import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',

    // Отключаем кеширование для динамических страниц
    staticPageGenerationTimeout: 1000,

    // Настройка заголовков кеширования
    async headers() {
        return [
            {
                source: '/catalog/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidate',
                    },
                ],
            },
            {
                source: '/:all*(svg|jpg|png|webp|gif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Добавляем заголовки безопасности
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ]
    },

    // Настройки изображений
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'asiamotors.su',
                pathname: '/**',
            },
        ],
        formats: ['image/webp'],
        qualities: [65, 75],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    poweredByHeader: false,

    // Конфигурация редиректов
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
