import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://asiamotors.su'
    const currentDate = new Date().toISOString()

    // Основные страницы
    const routes = [
        '',
        '/catalog',
        '/blog',
        '/about',
        '/contacts',
        '/services/delivery',
        '/services/insurance',
        '/services/used-cars',
        '/how-to-buy',
        '/spares',
        '/vacancies',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes]
}
