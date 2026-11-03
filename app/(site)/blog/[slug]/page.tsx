import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostsPage from '@/components/templates/BlogPage/PostsPage/PostsPage'
import PostArticle from '@/components/blog/PostArticle'
import { getBlogPost } from '@/shared/lib/server/blog'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = await getBlogPost(slug)
    if (!post) notFound()
    const title = post.document?.seoTitle || post.title
    const description = post.document?.seoDescription || post.excerpt
    const url = 'https://asiamotors.su/blog/' + encodeURIComponent(post.slug)
    return {
        title: post.document
            ? `${title} | AsiaMotors`
            : `${post.title} | AsiaMotors Blog`,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            type: 'article',
            url,
            images: [
                { url: post.image, width: 1200, height: 630, alt: post.title },
            ],
            ...(post.document
                ? {
                      publishedTime: post.date,
                      modifiedTime: post.updatedAt,
                      authors: [post.author],
                  }
                : {}),
        },
        ...(post.document
            ? {
                  twitter: {
                      card: 'summary_large_image',
                      title,
                      description,
                      images: [post.image],
                  },
              }
            : {}),
    }
}
export default async function Page({ params }: Props) {
    const post = await getBlogPost((await params).slug)
    if (!post) notFound()
    return post.document ? (
        <PostArticle
            document={post.document}
            slug={post.slug}
            publishedAt={post.date}
            updatedAt={post.updatedAt}
        />
    ) : (
        <PostsPage post={post} />
    )
}
