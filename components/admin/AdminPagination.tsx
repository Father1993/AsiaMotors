import Link from 'next/link'
export function AdminPagination({
    base,
    query,
    page,
    total,
    pageSize,
}: {
    base: string
    query: string
    page: number
    total: number
    pageSize: number
}) {
    const pages = Math.max(1, Math.ceil(total / pageSize))
    if (pages === 1 && page === 1) return null
    function href(next: number) {
        const params = new URLSearchParams(query)
        params.delete('page')
        if (next > 1) params.set('page', String(next))
        return base + (params.size ? '?' + params : '')
    }
    return (
        <nav aria-label="Страницы списка" className="admin-pagination">
            {page > 1 ? (
                <Link className="admin-button" href={href(page - 1)} scroll={false}>
                    ← Назад
                </Link>
            ) : (
                <span />
            )}
            <span>
                Страница {page} из {pages}
            </span>
            {page < pages ? (
                <Link className="admin-button" href={href(page + 1)} scroll={false}>
                    Далее →
                </Link>
            ) : (
                <span />
            )}
        </nav>
    )
}
