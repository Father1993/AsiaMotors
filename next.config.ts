/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/sitemap.xml',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/xml',
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
        ]
    },

    // Добавляем обработку редиректов
    async redirects() {
        return [
            {
                source: '/sitemap',
                destination: '/sitemap.xml',
                permanent: true,
            },
        ]
    },

    // // Включаем кеширование статических ресурсов
    // staticPageGenerationTimeout: 1000,
    // // Настройка заголовков кеширования
    // async headers() {
    //     return [
    //         {
    //             source: '/:all*(svg|jpg|png|webp|gif)',
    //             headers: [
    //                 {
    //                     key: 'Cache-Control',
    //                     value: 'public, max-age=31536000, immutable',
    //                 },
    //             ],
    //         },
    //         {
    //             source: '/_next/static/:path*',
    //             headers: [
    //                 {
    //                     key: 'Cache-Control',
    //                     value: 'public, max-age=31536000, immutable',
    //                 },
    //             ],
    //         },
    //     ]
    // },
}

export default nextConfig
