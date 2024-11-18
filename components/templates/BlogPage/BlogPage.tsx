'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/shared/types/common'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { useBreadcrumbs } from '@/shared/hooks/useBreadcrumbs'

const BlogPage = ({ posts }: { posts: Post[] }) => {
    const breadcrumbs = useBreadcrumbs()

    return (
        <div className="container py-16">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-bold text-4xl mb-12 mt-10">
                Блог компании AsiaMotors
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow mb-16"
                    >
                        <Link href={`/blog/${post.slug}`}>
                            <div className="relative h-48">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    quality={75}
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{post.author}</span>
                                    <span>
                                        {new Date(post.date).toLocaleDateString(
                                            'ru-RU'
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default BlogPage
