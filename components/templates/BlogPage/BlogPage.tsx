import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/shared/types/common'
export default function BlogPage({
    posts,
    page = 1,
    totalPages = 1,
}: {
    posts: Post[]
    page?: number
    totalPages?: number
}) {
    const href = (number: number) =>
        number === 1 ? '/blog' : '/blog/page/' + number
    return (
        <div className="container py-16">
            <nav aria-label="Хлебные крошки" className="mt-10">
                <Link href="/">Главная</Link> / Блог
            </nav>
            <h1 className="my-10 text-4xl font-bold">
                Блог компании Asia Motors{page > 1 ? ` — страница ${page}` : ''}
            </h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <article
                        key={post.slug}
                        className="mb-8 overflow-hidden rounded-xl bg-white shadow-lg"
                    >
                        <Link href={'/blog/' + encodeURIComponent(post.slug)}>
                            <div className="relative h-48">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width:767px) 90vw,(max-width:1023px) 45vw,30vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="mb-2 text-xl font-bold">
                                    {post.title}
                                </h2>
                                <p className="mb-4 text-gray-600">
                                    {post.excerpt}
                                </p>
                                <p className="flex justify-between text-sm text-gray-500">
                                    <span>{post.author}</span>
                                    <time dateTime={post.date}>
                                        {new Intl.DateTimeFormat('ru-RU', {
                                            timeZone: 'Asia/Vladivostok',
                                        }).format(new Date(post.date))}
                                    </time>
                                </p>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
            {totalPages > 1 && (
                <nav
                    aria-label="Страницы блога"
                    className="my-8 flex flex-wrap justify-center gap-3"
                >
                    {page > 1 && (
                        <Link
                            href={href(page - 1)}
                            className="rounded border px-4 py-3"
                        >
                            ← Назад
                        </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                            (n) =>
                                n === 1 ||
                                n === totalPages ||
                                Math.abs(n - page) <= 2,
                        )
                        .map((n) => (
                            <Link
                                href={href(n)}
                                key={n}
                                aria-current={page === n ? 'page' : undefined}
                                className={
                                    'rounded border px-4 py-3 ' +
                                    (page === n ? 'bg-red-600 text-white' : '')
                                }
                            >
                                {n}
                            </Link>
                        ))}
                    {page < totalPages && (
                        <Link
                            href={href(page + 1)}
                            className="rounded border px-4 py-3"
                        >
                            Далее →
                        </Link>
                    )}
                </nav>
            )}
        </div>
    )
}
