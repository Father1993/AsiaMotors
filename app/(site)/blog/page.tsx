import type { Metadata } from 'next'
import BlogPage from '@/components/templates/BlogPage/BlogPage'
import {
    getBlogPosts,
    blogSummary,
    BLOG_PAGE_SIZE,
} from '@/shared/lib/server/blog'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
    title: 'Блог об автомобилях | Asiamotors',
    description: 'Новости и обзоры автомобилей из Китая от AsiaMotors',
    alternates: { canonical: 'https://asiamotors.su/blog' },
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
}
export default async function Blog() {
    const posts = await getBlogPosts()
    return (
        <BlogPage
            posts={posts.slice(0, BLOG_PAGE_SIZE).map(blogSummary)}
            totalPages={Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE))}
        />
    )
}
