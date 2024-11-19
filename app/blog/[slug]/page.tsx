/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { notFound } from 'next/navigation'
import PostsPage from '@/components/templates/BlogPage/PostsPage/PostsPage'
import { getPostBySlug } from '@/shared/utils/posts'
import { PageProps } from '@/shared/types/common'

// Функция для безопасного получения slug
async function getSlug(params: PageProps['params']) {
    const resolvedParams = params instanceof Promise ? await params : params
    return resolvedParams.slug
}

// Функция для получения метаданных
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    try {
        // Дожидаемся получения slug
        const slug = await getSlug(params)
        const post = await getPostBySlug(slug)

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
                url: `https://asiamotors.su/blog/${slug}`,
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
    } catch {
        return {
            title: 'Ошибка | AsiaMotors',
            description: 'Произошла ошибка при загрузке поста',
        }
    }
}

// Основной компонент страницы
export default async function Page({ params }: PageProps) {
    // Дожидаемся получения slug
    const slug = await getSlug(params)
    const post = await getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return <PostsPage post={post} />
}
