'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PostsPageProps } from '@/shared/types/common'
import ArrowLeft from '@/components/ui/ArrowLeft'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { useBreadcrumbs } from '@/shared/hooks/useBreadcrumbs'

const PostsPage = ({ post }: PostsPageProps) => {
    const breadcrumbs = useBreadcrumbs(post?.title)

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="container py-16">
                <Breadcrumbs items={breadcrumbs} />
                <article className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8">
                    <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            quality={75}
                            priority
                        />
                    </div>

                    {/* Мета-информация */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-800">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-500">
                            <span className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                {post.author}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                {new Date(post.date).toLocaleDateString(
                                    'ru-RU'
                                )}
                            </span>
                            {post.readingTime && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {post.readingTime}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Теги */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Контент */}
                    <div
                        className="prose prose-lg max-w-none 
                                    prose-headings:text-gray-800 
                                    prose-headings:font-bold
                                    prose-h1:text-4xl
                                    prose-h2:text-3xl
                                    prose-h3:text-2xl
                                    prose-p:text-gray-600
                                    prose-a:text-blue-600 
                                    prose-a:no-underline
                                    prose-strong:text-gray-800
                                    prose-img:rounded-xl
                                    prose-img:shadow-lg
                                    prose-table:rounded-xl
                                    prose-table:overflow-hidden
                                    prose-table:shadow-lg
                                    prose-ul:list-disc
                                    prose-ul:pl-6
                                    prose-li:my-2"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Кнопка возврата */}
                    <div className="flex justify-center mt-12">
                        <Link
                            href="/blog"
                            className="group px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-red-600 
                            text-white font-semibold tracking-wider shadow-md hover:shadow-lg transition-all 
                            duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
                            Вернуться к блогу
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default PostsPage
