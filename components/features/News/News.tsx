'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    CalendarIcon,
    ClockIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { getAllPosts } from '@/shared/utils/posts'
import { Post } from '@/shared/types/common'

const News = () => {
    // Добавляем состояние для хранения постов
    const [posts, setPosts] = useState<Post[]>([])

    // Загружаем посты при монтировании компонента
    useEffect(() => {
        const loadPosts = async () => {
            const allPosts = await getAllPosts()
            // Берем только последние 3 поста
            setPosts(allPosts.slice(0, 3))
        }
        loadPosts()
    }, [])

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container">
                <div className="flex justify-between items-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
                    >
                        Новости и обзоры
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        ``
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-300"
                        >
                            <span>Все статьи</span>
                            <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                                                {post.tags[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>{post.readingTime}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-red-600 transition-colors duration-300">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 line-clamp-2 mb-4">
                                        {post.excerpt}
                                    </p>

                                    <div className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-300">
                                        <span>Читать далее</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default News
