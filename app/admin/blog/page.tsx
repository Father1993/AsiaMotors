import { Field } from '@/components/admin/Field'
import Link from 'next/link'
import Image from 'next/image'
import { requireAdmin } from '@/shared/lib/server/http'
import { listBlogAdminItems } from '@/shared/lib/server/posts'
import { adminDate } from '@/shared/lib/admin-date'
import { AdminPagination } from '@/components/admin/AdminPagination'
export const metadata = { title: 'Блог | AsiaMotors' }
const statusNames = {
    draft: 'Черновик',
    published: 'Опубликована',
    hidden: 'Скрыта',
    scheduled: 'Запланирована',
}
export default async function BlogAdmin({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string
        status?: string
        source?: string
        page?: string
    }>
}) {
    await requireAdmin()
    const input = await searchParams
    const params = new URLSearchParams()
    for (const key of ['q', 'status', 'source', 'page'] as const)
        if (typeof input[key] === 'string' && input[key])
            params.set(key, input[key])
    const { posts, total, page, pageSize } = await listBlogAdminItems(params)
    const returnTo = '/admin/blog' + (params.size ? '?' + params : '')
    const filters = !!(
        input.q ||
        input.status ||
        (input.source && input.source !== 'all')
    )
    return (
        <>
            <div className="admin-titlebar">
                <div>
                    <h1>Блог</h1>
                    <p className="admin-muted">
                        Новые публикации и архив статей AsiaMotors
                    </p>
                </div>
                <div className="admin-blog-actions">
                    <Link
                        className="admin-button"
                        href="/blog"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Открыть блог на сайте ↗
                    </Link>
                    <Link
                        className="admin-button admin-button-primary"
                        href={
                            '/admin/blog/new?returnTo=' +
                            encodeURIComponent(returnTo)
                        }
                    >
                        Создать статью
                    </Link>
                </div>
            </div>
            <p className="admin-readonly-note">
                Архивные статьи доступны только для просмотра. Новые статьи
                сохраняются как черновики и публикуются отдельным действием.
            </p>
            <section
                className="admin-panel admin-filter-panel"
                aria-label="Поиск статей"
            >
                <form
                    key={params.toString()}
                    action="/admin/blog"
                    className="admin-filter-form"
                >
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
                            placeholder="Например, Toyota…"
                            defaultValue={input.q || ''}
                        />
                    </Field>
                    <Field name="blog-source" label="Источник">
                        <select
                            id="blog-source"
                            name="source"
                            defaultValue={input.source || 'all'}
                        >
                            <option value="all">Все материалы</option>
                            <option value="new">Новые статьи</option>
                            <option value="archive">Архивные статьи</option>
                        </select>
                    </Field>
                    <Field name="blog-status" label="Состояние">
                        <select
                            id="blog-status"
                            name="status"
                            defaultValue={input.status || ''}
                        >
                            <option value="">Все состояния</option>
                            {Object.entries(statusNames).map(
                                ([value, label]) => (
                                    <option value={value} key={value}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>
                    <button type="submit" className="admin-button">
                        Найти
                    </button>
                    {filters && (
                        <Link
                            href="/admin/blog"
                            className="admin-button admin-button-quiet"
                        >
                            Сбросить
                        </Link>
                    )}
                </form>
            </section>
            <p className="admin-blog-count">
                Найдено: <strong>{total}</strong>
            </p>
            {posts.length === 0 ? (
                <div className="admin-panel admin-empty">
                    <h2>Статьи не найдены</h2>
                    <p className="admin-muted">
                        Измените запрос или создайте новую статью.
                    </p>
                </div>
            ) : (
                <ul className="admin-blog-grid">
                    {posts.map((post) => {
                        const href =
                            (post.source === 'archive'
                                ? '/admin/blog/' + encodeURIComponent(post.slug)
                                : '/admin/blog/edit/' + post.id) +
                            '?returnTo=' +
                            encodeURIComponent(returnTo)
                        return (
                            <li
                                key={post.id || post.slug}
                                className="admin-panel admin-blog-card"
                            >
                                {post.image && (
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
                                )}
                                <div className="admin-blog-card-body">
                                    <div className="admin-blog-meta">
                                        <time dateTime={post.date}>
                                            {adminDate(post.date, true)}
                                        </time>
                                        <span>{post.author}</span>
                                    </div>
                                    <h2>
                                        <Link href={href}>{post.title}</Link>
                                    </h2>
                                    <p className="admin-muted admin-blog-excerpt">
                                        {post.excerpt}
                                    </p>
                                    <div className="admin-blog-tags">
                                        <span className="admin-badge">
                                            {post.source === 'archive'
                                                ? 'Архив · только чтение'
                                                : statusNames[post.status]}
                                        </span>
                                        {post.hasChanges && (
                                            <span className="admin-badge admin-badge-warning">
                                                Есть неопубликованные изменения
                                            </span>
                                        )}
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                    {post.scheduledAt && (
                                        <p className="admin-badge admin-badge-warning">
                                            Публикация: {adminDate(post.scheduledAt)} · Владивосток
                                        </p>
                                    )}
                                    {post.missingImages.length > 0 && (
                                        <span className="admin-badge admin-badge-warning">
                                            Недоступно изображений:{' '}
                                            {post.missingImages.length}
                                        </span>
                                    )}
                                    <div className="admin-blog-actions">
                                        <Link
                                            href={href}
                                            className="admin-button"
                                        >
                                            {post.source === 'archive'
                                                ? 'Читать'
                                                : 'Редактировать'}
                                            <span className="sr-only">
                                                {' '}
                                                {post.title}
                                            </span>
                                        </Link>
                                        {post.status === 'published' && (
                                            <Link
                                                href={
                                                    '/blog/' +
                                                    encodeURIComponent(
                                                        post.slug,
                                                    )
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="admin-button admin-button-quiet"
                                            >
                                                На сайте ↗
                                                <span className="sr-only">
                                                    {' '}
                                                    {post.title}
                                                </span>
                                            </Link>
                                        )}
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
                total={total}
                pageSize={pageSize}
            />
        </>
    )
}
