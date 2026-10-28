import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/shared/lib/server/http'
import { getAllPostSlugs, getPostBySlug } from '@/shared/utils/posts'
import { missingPostImages, adminPostContent } from '@/shared/lib/server/admin-blog'
import { adminDate } from '@/shared/lib/admin-date'
import { adminReturnTo } from '@/shared/lib/admin-navigation'
export default async function BlogArticle({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ returnTo?: string }>
}) {
    await requireAdmin()
    const { slug } = await params
    // Resolve only existing filenames: URL input must never become an arbitrary file path.
    if (!(await getAllPostSlugs()).includes(slug)) notFound()
    const post = await getPostBySlug(slug)
    if (!post) notFound()
    const missing = await missingPostImages(post)
    const returnTo = adminReturnTo((await searchParams).returnTo, '/admin/blog')
    return (
        <>
            <Link href={returnTo} className="admin-back">
                ← К статьям
            </Link>
            <div className="admin-titlebar">
                <div>
                    <span className="admin-badge admin-badge-neutral">Просмотр статьи</span>
                </div>
                <Link
                    href={'/blog/' + encodeURIComponent(post.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-button"
                >
                    Открыть на сайте ↗
                </Link>
            </div>
            {missing.length > 0 && (
                <section className="admin-panel admin-image-warning" aria-label="Изображения статьи">
                    <strong>Недоступно изображений: {missing.length}</strong>
                    <p>
                        Исходные файлы не найдены. Текст и остальные фотографии сохранены; недостающие
                        иллюстрации можно восстановить отдельно.
                    </p>
                    <details>
                        <summary>Показать адреса файлов</summary>
                        <ul>
                            {missing.map((url) => (
                                <li key={url}>{url}</li>
                            ))}
                        </ul>
                    </details>
                </section>
            )}
            <article className="admin-panel admin-blog-article">
                <header>
                    <p className="admin-blog-meta">
                        <time dateTime={post.date}>{adminDate(post.date, true)}</time>
                        <span>{post.author}</span>
                        {post.readingTime && <span>{post.readingTime}</span>}
                    </p>
                    <h1>{post.title}</h1>
                    <p className="admin-article-excerpt">{post.excerpt}</p>
                    <div className="admin-blog-tags">
                        {post.tags?.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </div>
                    <div className="admin-blog-cover">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 767px) 90vw, 900px"
                            loading="eager"
                        />
                    </div>
                </header>
                <div
                    className="admin-article-content"
                    dangerouslySetInnerHTML={{ __html: adminPostContent(post, missing) }}
                />
            </article>
        </>
    )
}
