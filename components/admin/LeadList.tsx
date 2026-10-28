'use client'
import { Field } from '@/components/admin/Field'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApiError, apiRequest } from '@/shared/lib/catalog-client'
import { formNames, leadStatusLabels, phoneHref, type LeadsResult } from '@/shared/lib/leads'
import { adminDate } from '@/shared/lib/admin-date'
import { AdminPagination } from './AdminPagination'
import { LeadStatusBadge, MailMode, MailStatusBadge } from './LeadStatus'

export function LeadList() {
    const params = useSearchParams()
    const router = useRouter()
    const query = params.toString()
    const [result, setResult] = useState<LeadsResult | null>(null)
    const [error, setError] = useState<ApiError | null>(null)
    const [revision, setRevision] = useState(0)
    const key = query + ':' + revision
    const [loaded, setLoaded] = useState<string | null>(null)
    const loading = loaded !== key
    useEffect(() => {
        const controller = new AbortController()
        apiRequest<LeadsResult>('/api/admin/leads' + (query ? '?' + query : ''), {
            signal: controller.signal,
        })
            .then((data) => {
                if (!controller.signal.aborted) {
                    setResult(data)
                    setError(null)
                }
            })
            .catch((cause) => {
                if (!controller.signal.aborted) {
                    setResult(null)
                    setError(
                        cause instanceof ApiError
                            ? cause
                            : new ApiError('Не удалось загрузить заявки. Проверьте соединение.', 0),
                    )
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoaded(key)
            })
        return () => controller.abort()
    }, [query, key])
    function statusUrl(status: string) {
        const next = new URLSearchParams(query)
        next.delete('page')
        next.delete('status')
        if (status) next.set('status', status)
        return '/admin/requests' + (next.size ? '?' + next : '')
    }
    const returnTo = '/admin/requests' + (query ? '?' + query : '')
    return (
        <>
            <div className="admin-titlebar">
                <div>
                    <h1>Заявки с сайта</h1>
                    <p className="admin-muted">Контакты клиентов, обработка обращений и отправка писем</p>
                </div>
                <button className="admin-button" onClick={() => setRevision((v) => v + 1)} disabled={loading}>
                    {loading ? 'Обновление…' : 'Обновить'}
                </button>
            </div>
            {result && <MailMode enabled={result.mailDeliveryEnabled} pending={result.summary.pending} />}
            <nav className="admin-status-tabs" aria-label="Состояние обработки">
                {[['', 'Все'], ...Object.entries(leadStatusLabels)].map(([status, label]) => (
                    <Link
                        key={status}
                        href={statusUrl(status)}
                        aria-current={(params.get('status') || '') === status ? 'page' : undefined}
                        scroll={false}
                    >
                        {label}{' '}
                        {result && (
                            <span>
                                {status
                                    ? result.summary[status as keyof typeof leadStatusLabels]
                                    : result.summary.new + result.summary.processing + result.summary.closed}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
            <section className="admin-panel admin-filter-panel" aria-label="Фильтры заявок">
                <form
                    key={query}
                    className="admin-filter-form"
                    onSubmit={(event) => {
                        event.preventDefault()
                        const next = new URLSearchParams()
                        for (const [name, value] of new FormData(event.currentTarget))
                            if (typeof value === 'string' && value.trim()) next.set(name, value.trim())
                        router.push('/admin/requests' + (next.size ? '?' + next : ''), { scroll: false })
                    }}
                >
                    {params.get('status') && (
                        <input type="hidden" name="status" value={params.get('status')!} />
                    )}
                    <Field
                        name="lead-search"
                        label="Имя, телефон или автомобиль"
                        className="admin-filter-search"
                    >
                        <input
                            id="lead-search"
                            name="q"
                            autoComplete="off"
                            type="search"
                            maxLength={150}
                            placeholder="Например, Camry или номер телефона…"
                            defaultValue={params.get('q') || ''}
                        />
                    </Field>
                    <Field name="lead-form" label="Источник заявки">
                        <select id="lead-form" name="form" defaultValue={params.get('form') || ''}>
                            <option value="">Все формы</option>
                            {formNames.map((form) => (
                                <option key={form}>{form}</option>
                            ))}
                        </select>
                    </Field>
                    <Field name="lead-mail" label="Отправка письма">
                        <select id="lead-mail" name="mail" defaultValue={params.get('mail') || ''}>
                            <option value="">Все состояния</option>
                            <option value="pending">Ожидает отправки</option>
                            <option value="sent">Принято сервером</option>
                            <option value="failed">Ошибка отправки</option>
                        </select>
                    </Field>
                    <button className="admin-button" type="submit">
                        Найти
                    </button>
                    {query && (
                        <Link className="admin-button admin-button-quiet" href="/admin/requests">
                            Сбросить
                        </Link>
                    )}
                </form>
            </section>
            {!loading && error && (
                <div role="alert" className="admin-notice admin-feedback">
                    <p>{error.message}</p>
                    {error.status === 401 ? (
                        <Link className="admin-button" href="/auth/signin?callbackUrl=%2Fadmin%2Frequests">
                            Войти снова
                        </Link>
                    ) : (
                        <button className="admin-button" onClick={() => setRevision((v) => v + 1)}>
                            Повторить загрузку
                        </button>
                    )}
                </div>
            )}
            <section className="admin-panel admin-records" aria-label="Список заявок" aria-busy={loading}>
                {loading ? (
                    <p role="status" className="admin-empty">
                        Загрузка заявок…
                    </p>
                ) : (
                    result && (
                        <>
                            <p className="admin-result-count">
                                Найдено: <strong>{result.total}</strong>
                            </p>
                            {result.leads.length === 0 ? (
                                <div className="admin-empty">
                                    <h2>{query ? 'Заявки не найдены' : 'Заявок пока нет'}</h2>
                                    <p className="admin-muted">
                                        {query
                                            ? 'Измените условия поиска или сбросьте фильтры.'
                                            : 'Здесь появятся обращения, отправленные через формы сайта.'}
                                    </p>
                                </div>
                            ) : (
                                <ul className="request-list">
                                    {result.leads.map((lead) => {
                                        const href =
                                            '/admin/requests/' +
                                            lead.id +
                                            '?returnTo=' +
                                            encodeURIComponent(returnTo)
                                        return (
                                            <li key={lead.id} className="request-row">
                                                <div className="request-client">
                                                    <Link className="admin-record-title" href={href}>
                                                        {lead.payload.user_name}
                                                    </Link>
                                                    <a
                                                        className="admin-phone"
                                                        href={phoneHref(lead.payload.user_phone)}
                                                    >
                                                        {lead.payload.user_phone}
                                                    </a>
                                                    {lead.payload.user_city && (
                                                        <span className="admin-muted">
                                                            {lead.payload.user_city}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="request-subject">
                                                    <strong>
                                                        {lead.payload.car_model ||
                                                            lead.payload.part_name ||
                                                            'Обращение клиента'}
                                                    </strong>
                                                    <p className="admin-muted">{lead.payload.form_name}</p>
                                                    <time dateTime={lead.created_at}>
                                                        {adminDate(lead.created_at)}
                                                    </time>
                                                </div>
                                                <div className="request-state">
                                                    <span className="admin-caption">Обработка</span>
                                                    <LeadStatusBadge status={lead.status} />
                                                </div>
                                                <div className="request-delivery">
                                                    <span className="admin-caption">Письмо</span>
                                                    <MailStatusBadge
                                                        lead={lead}
                                                        enabled={result.mailDeliveryEnabled}
                                                    />
                                                </div>
                                                <Link className="admin-button request-open" href={href}>
                                                    Открыть
                                                    <span className="sr-only">
                                                        {' '}
                                                        заявку {lead.payload.user_name}
                                                    </span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                            <AdminPagination
                                base="/admin/requests"
                                query={query}
                                page={result.page}
                                total={result.total}
                                pageSize={result.pageSize}
                            />
                        </>
                    )
                )}
            </section>
            <p className="admin-footnote">Время — Владивосток.</p>
        </>
    )
}
