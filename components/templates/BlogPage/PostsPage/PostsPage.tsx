'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/shared/types/common'

const PostsPage = ({ post }: { post: Post }) => {
    return (
        <div className="container py-16">
            <article className="max-w-4xl mx-auto">
                <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
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
                </div>
                <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-700">
                    {post.content}
                </div>
                <div className="flex justify-center mt-10">
                    <Link
                        href="/blog"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-red-600 text-white 
                        font-semibold tracking-wider shadow-md hover:shadow-lg transition-all duration-300 
                        transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-blue-500 flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Обратно к списку постов
                    </Link>
                </div>
            </article>
        </div>
    )
}

export default PostsPage
