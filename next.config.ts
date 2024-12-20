import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Включаем кеширование статических ресурсов
    staticPageGenerationTimeout: 1000,

    // Настройка заголовков кеширования
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp|gif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
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
        domains: ['asiamotors.su', 'zyhimbzmgypjlzydvelv.supabase.co'],
        formats: ['image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Оптимизация производительности
    swcMinify: true,
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
