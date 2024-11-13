import { Metadata } from 'next'
import PostsPage from '@/components/templates/BlogPage/PostsPage/PostsPage'
import { notFound } from 'next/navigation'
import { POSTS } from '@/shared/constants/posts'

interface Props {
    params: Promise<{ slug: string }>
}

// Функция для получения поста
async function getPost(params: Props['params']) {
    const { slug } = await params
    return POSTS.find((post) => post.slug === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPost(params)

    if (!post) {
        return {
            title: 'Пост не найден | AsiaMotors',
            description: 'Запрашиваемый пост не найден',
        }
    }

    return {
        title: `${post.title} | AsiaMotors Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            url: `https://asiamotors.su/blog/${post.slug}`,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    }
}

export default async function PostPage({ params }: Props) {
    const post = await getPost(params)

    if (!post) {
        notFound()
    }

    return <PostsPage post={post} />
}

// Генерация статических параметров
export async function generateStaticParams() {
    return POSTS.map((post) => ({
        slug: post.slug,
    }))
}
