import { Metadata } from 'next'
import PostsPage from '@/components/templates/BlogPage/PostsPage/PostsPage'
import { notFound } from 'next/navigation'
import { POSTS } from '@/shared/constants/posts'

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = POSTS.find((post) => post.slug === params.slug)

    if (!post) {
        return {
            title: 'Пост не найден | AsiaMotors',
        }
    }

    return {
        title: `${post.title} | AsiaMotors Blog`,
        description: post.excerpt,
    }
}

export default function PostPage({ params }: Props) {
    const post = POSTS.find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }

    return <PostsPage post={post} />
}

export function generateStaticParams() {
    return POSTS.map((post) => ({
        slug: post.slug,
    }))
}
