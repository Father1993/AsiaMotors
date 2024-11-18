'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/shared/types/common'
import ArrowLeft from '@/components/ui/ArrowLeft'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { useBreadcrumbs } from '@/shared/hooks/useBreadcrumbs'

const PostsPage = ({ post }: { post: Post }) => {
    const breadcrumbs = useBreadcrumbs(post?.title)

    return (
        <div className="container py-16">
            {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
            <article className="max-w-4xl mx-auto mt-12">
                <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        quality={75}
                        loading="lazy"
                    />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 mb-8">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>
                        {new Date(post.date).toLocaleDateString('ru-RU')}
                    </span>
                    {post.readingTime && (
                        <>
                            <span>•</span>
                            <span>{post.readingTime}</span>
                        </>
                    )}
                </div>
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex justify-center mt-10 mb-16">
                    <Link
                        href="/blog"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-red-600 text-white 
                        font-semibold tracking-wider shadow-md hover:shadow-lg transition-all duration-300 
                        transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-blue-500 flex items-center gap-2"
                    >
                        <ArrowLeft />
                        Обратно к списку постов
                    </Link>
                </div>
            </article>
        </div>
    )
}

export default PostsPage
