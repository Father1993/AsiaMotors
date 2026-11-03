import 'server-only'
import { cache } from 'react'
import { getAllPosts, getPostBySlug } from '@/shared/utils/posts'
import { getPublishedPosts, getPublishedPost } from './posts'
import { documentText, type PostDocument } from '../post-schema'
import type { Post } from '@/shared/types/common'
export type BlogPost = Post & { document?: PostDocument; updatedAt?: string }
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
    const [legacy, rows] = await Promise.all([
        getAllPosts(),
        getPublishedPosts(),
    ])
    return [
        ...legacy,
        ...rows.map((row) => ({
            id: row.id,
            slug: row.slug,
            title: row.published!.title,
            excerpt: row.published!.excerpt,
            content: '',
            date: row.published_at!,
            author: row.published!.author,
            image: row.published!.cover,
            tags: row.published!.tags,
            updatedAt: row.publication_updated_at!,
            document: row.published!,
            readingTime:
                Math.max(
                    1,
                    Math.ceil(
                        documentText(row.published!.content).split(/\s+/)
                            .length / 200,
                    ),
                ) + ' мин.',
        })),
    ].sort(
        (a, b) =>
            Date.parse(b.date) - Date.parse(a.date) ||
            a.slug.localeCompare(b.slug),
    )
})
export const getBlogPost = cache(
    async (slug: string): Promise<BlogPost | null> => {
        const legacy = await getPostBySlug(slug)
        if (legacy) return legacy
        const row = await getPublishedPost(slug)
        if (!row?.published) return null
        const d = row.published
        return {
            id: row.id,
            slug: row.slug,
            title: d.title,
            excerpt: d.excerpt,
            content: '',
            date: row.published_at!,
            author: d.author,
            image: d.cover,
            tags: d.tags,
            document: d,
            updatedAt: row.publication_updated_at!,
        }
    },
)
export const BLOG_PAGE_SIZE = 12

export function blogSummary(post: BlogPost): Post {
    return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: '',
        date: post.date,
        author: post.author,
        image: post.image,
        slug: post.slug,
        readingTime: post.readingTime,
        tags: post.tags,
    }
}
