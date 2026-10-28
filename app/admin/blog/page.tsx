import { Field } from '@/components/admin/Field'
import Link from 'next/link'
import Image from 'next/image'
import { requireAdmin } from '@/shared/lib/server/http'
import { adminBlogPosts } from '@/shared/lib/server/admin-blog'
import { adminDate } from '@/shared/lib/admin-date'
import { AdminPagination } from '@/components/admin/AdminPagination'
export const metadata = { title: 'Блог | AsiaMotors' }
export default async function BlogAdmin({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; tag?: string; page?: string }>
}) {
    await requireAdmin()
    const input = await searchParams
    const q = typeof input.q === 'string' ? input.q.slice(0, 150).trim() : ''
    const tag = typeof input.tag === 'string' ? input.tag : ''
    const posts = await adminBlogPosts()
    const tags = [...new Set(posts.flatMap((post) => post.tags || []))].sort((a, b) =>
        a.localeCompare(b, 'ru'),
    )
    const filtered = posts.filter(
        (post) =>
            (!tag || post.tags?.includes(tag)) &&
            (!q ||
                [post.title, post.excerpt, post.author, ...(post.tags || [])]
                    .join(' ')
                    .toLocaleLowerCase('ru')
                    .includes(q.toLocaleLowerCase('ru'))),
    )
    const pageSize = 12
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const page = Math.min(pages, Math.max(1, Number.parseInt(input.page || '1') || 1))
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (tag) params.set('tag', tag)
    const returnTo =
        '/admin/blog' +
        (params.size ? '?' + params : '') +
        (page > 1 ? (params.size ? '&' : '?') + 'page=' + page : '')
    return (
        <>
            <div className="admin-titlebar">
                <div>
                    <h1>Блог</h1>
                    <p className="admin-muted">{posts.length} опубликованных статей · просмотр материалов</p>
                </div>
                <Link className="admin-button" href="/blog" target="_blank" rel="noopener noreferrer">
                    Открыть блог на сайте ↗
                </Link>
            </div>
            <p className="admin-readonly-note">
                Сейчас доступен просмотр статей. Создание и редактирование добавим отдельно.
            </p>
            <section className="admin-panel admin-filter-panel" aria-label="Поиск статей">
                <form key={params.toString()} action="/admin/blog" className="admin-filter-form">
                    <Field
                        name="blog-search"
                        label="Название, тема или автор"
                        className="admin-filter-search"
                    >
                        <input
                            id="blog-search"
                            name="q"
                            type="search"
                            maxLength={150}
                            autoComplete="off"
                            placeholder="Например, Toyota…"
                            defaultValue={q}
                        />
                    </Field>
                    <Field name="blog-tag" label="Тег">
                        <select id="blog-tag" name="tag" defaultValue={tag}>
                            <option value="">Все теги</option>
                            {tags.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </Field>
                    <button type="submit" className="admin-button">
                        Найти
                    </button>
                    {(q || tag) && (
                        <Link href="/admin/blog" className="admin-button admin-button-quiet">
                            Сбросить
                        </Link>
                    )}
                </form>
            </section>
            <p className="admin-blog-count">
                Найдено: <strong>{filtered.length}</strong>
            </p>
            {filtered.length === 0 ? (
                <div className="admin-panel admin-empty">
                    <h2>Статьи не найдены</h2>
                    <p className="admin-muted">Измените запрос или сбросьте фильтры.</p>
                </div>
            ) : (
                <ul className="admin-blog-grid">
                    {filtered.slice((page - 1) * pageSize, page * pageSize).map((post) => {
                        const href =
                            '/admin/blog/' +
                            encodeURIComponent(post.slug) +
                            '?returnTo=' +
                            encodeURIComponent(returnTo)
                        return (
                            <li key={post.slug} className="admin-panel admin-blog-card">
                                <Link
                                    href={href}
                                    className="admin-blog-image"
                                    aria-hidden="true"
                                    tabIndex={-1}
                                >
                                    <Image
                                        src={post.image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 767px) 90vw, (max-width: 1100px) 45vw, 400px"
                                    />
                                </Link>
                                <div className="admin-blog-card-body">
                                    <div className="admin-blog-meta">
                                        <time dateTime={post.date}>{adminDate(post.date, true)}</time>
                                        <span>{post.author}</span>
                                    </div>
                                    <h2>
                                        <Link href={href}>{post.title}</Link>
                                    </h2>
                                    <p className="admin-muted admin-blog-excerpt">{post.excerpt}</p>
                                    {post.missingImages.length > 0 && (
                                        <span className="admin-badge admin-badge-warning">
                                            Недоступно изображений: {post.missingImages.length}
                                        </span>
                                    )}
                                    <div className="admin-blog-tags">
                                        {post.tags?.slice(0, 3).map((item) => (
                                            <span key={item}>{item}</span>
                                        ))}
                                    </div>
                                    <div className="admin-blog-actions">
                                        <Link href={href} className="admin-button">
                                            Читать<span className="sr-only"> {post.title}</span>
                                        </Link>
                                        <Link
                                            href={'/blog/' + encodeURIComponent(post.slug)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="admin-button admin-button-quiet"
                                        >
                                            На сайте ↗<span className="sr-only"> {post.title}</span>
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
            <AdminPagination
                base="/admin/blog"
                query={params.toString()}
                page={page}
                total={filtered.length}
                pageSize={pageSize}
            />
        </>
    )
}
