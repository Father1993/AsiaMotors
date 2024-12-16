import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://asiamotors.su'

    const routes = ['', '/contact', '/blog', '/about', '/privacy-policy']

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency:
            route === ''
                ? 'daily'
                : route === '/blog'
                ? 'weekly'
                : route === '/about'
                ? 'weekly'
                : route === '/contact'
                ? 'monthly'
                : 'yearly',
        priority:
            route === ''
                ? 1
                : route === '/about'
                ? 0.9
                : route === '/blog'
                ? 0.8
                : route === '/contact'
                ? 0.7
                : 0.5,
    }))
}
