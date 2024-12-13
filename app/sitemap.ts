import { MetadataRoute } from 'next'
import { getAllPosts } from '@/shared/utils/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://asiamotors.su'

    // Получаем все посты блога
    const posts = await getAllPosts()
    const blogPosts = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date).toISOString(), // Добавляем toISOString()
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    // Основные маршруты
    const routes = [
        // Главные страницы
        { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
        {
            url: `${baseUrl}/catalog`,
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },

        // Сервисные страницы
        {
            url: `${baseUrl}/services`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/delivery`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/customs`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/insurance`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/new-cars`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/used-cars`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },

        // Информационные страницы
        {
            url: `${baseUrl}/about`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/how-to-buy`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/spares`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/vacancies`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },

        // Юридические страницы
        {
            url: `${baseUrl}/privacy`,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
    ].map((route) => ({
        ...route,
        lastModified: new Date().toISOString(), // Добавляем toISOString()
    }))

    return [...routes, ...blogPosts]
}
