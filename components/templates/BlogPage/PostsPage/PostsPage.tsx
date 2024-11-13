import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/shared/types/common'

const PostsPage = ({ post }: { post: Post }) => {
    return (
        <div className="container py-16">
            <article className="max-w-4xl mx-auto">
                <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden">
                    <Image
                        src={post.image} // Было POSTS.image
                        alt={post.title} // Было POSTS.title
                        fill
                        className="object-cover"
                    />
                </div>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-500 mb-8">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>
                        {new Date(post.date).toLocaleDateString('ru-RU')}
                    </span>
                </div>
                <div className="prose prose-lg max-w-none whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>
            <Link
                href="/blog"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-10"
            >
                ← Обратно к списку постов
            </Link>
        </div>
    )
}

export default PostsPage
