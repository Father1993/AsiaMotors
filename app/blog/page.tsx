import { Metadata } from 'next'
import BlogPage from '@/components/templates/BlogPage/BlogPage'
import { getAllPosts } from '@/shared/utils/posts'

export const metadata: Metadata = {
    title: 'Блог об автомобилях | Asiamotors',
    description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
    openGraph: {
        title: 'Блог об автомобилях | Asiamotors',
        description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
        type: 'website',
        url: 'https://asiamotors.su/blog',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 192,
                height: 192,
                alt: 'Логотип Asiamotors',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'Блог об автомобилях | Asiamotors',
        description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
}

export default async function BlogPages() {
    const posts = await getAllPosts()
    return <BlogPage posts={posts} />
}
