import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://asiamotors.su'

    const routes = [
        '',
        '/catalog',
        '/services',
        '/services/new-cars',
        '/services/used-cars',
        '/services/delivery',
        '/services/customs',
        '/services/insurance',
        '/blog',
        '/about',
        '/contacts',
        '/privacy-policy',
        '/how-to-buy',
        '/spares',
        '/vacancies',
        '/faq',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changefreq: getChangeFrequency(route),
        priority: getPriority(route),
    }))
}

function getChangeFrequency(
    route: string
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
    switch (route) {
        case '':
        case '/catalog':
            return 'daily'
        case '/blog':
        case '/services/new-cars':
        case '/services/used-cars':
            return 'weekly'
        case '/about':
        case '/contacts':
        case '/services':
            return 'monthly'
        default:
            return 'yearly'
    }
}

function getPriority(route: string): number {
    switch (route) {
        case '':
            return 1.0
        case '/catalog':
        case '/services':
            return 0.9
        case '/services/new-cars':
        case '/services/used-cars':
        case '/blog':
            return 0.8
        case '/about':
        case '/contacts':
            return 0.7
        default:
            return 0.5
    }
}
