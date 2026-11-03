import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import BlogPage from '@/components/templates/BlogPage/BlogPage'
import {
    getBlogPosts,
    blogSummary,
    BLOG_PAGE_SIZE,
} from '@/shared/lib/server/blog'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ page: string }> }
async function pagination(params: Props['params']) {
    const input = (await params).page
    if (!/^[1-9]\d{0,5}$/.test(input)) notFound()
    const page = Number(input)
    if (page === 1) permanentRedirect('/blog')
    return page
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const page = await pagination(params)
    return {
        title: `Блог об автомобилях — страница ${page} | AsiaMotors`,
        alternates: { canonical: 'https://asiamotors.su/blog/page/' + page },
    }
}
export default async function Blog({ params }: Props) {
    const page = await pagination(params)
    const posts = await getBlogPosts()
    const pages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE))
    if (page > pages) notFound()
    return (
        <BlogPage
            posts={posts
                .slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE)
                .map(blogSummary)}
            page={page}
            totalPages={pages}
        />
    )
}
