import Link from 'next/link'

const PostsPage = () => {
    return (
        <div className="container">
            Это посты
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
