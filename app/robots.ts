import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/login/',
                    '/signup/',
                    '/404',
                    '/*?*',
                    '/*.json$',
                    '/*.xml$',
                    '/*.txt$',
                ],
            },
            {
                userAgent: '*',
                allow: [
                    '/blog/',
                    '/calculate/',
                    '/services/',
                    '/about/',
                    '/contact/',
                ],
            },
        ],
        sitemap: 'https://asiamotors.su/sitemap.xml',
        host: 'https://asiamotors.su',
    }
}
