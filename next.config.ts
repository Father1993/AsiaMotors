/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
