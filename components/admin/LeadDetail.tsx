'use client'
import { Field } from '@/components/admin/Field'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ApiError, apiRequest } from '@/shared/lib/catalog-client'
import { adminDate } from '@/shared/lib/admin-date'
import {
    leadFieldLabels,
    leadStatusLabels,
    phoneHref,
    type AdminLead,
    type LeadStatus,
} from '@/shared/lib/leads'
import { ConfirmDialog } from './ConfirmDialog'
import { LeadStatusBadge, MailMode, MailStatusBadge } from './LeadStatus'
const mailErrors: Record<string, string> = {
    EAUTH: 'Почтовый сервер отклонил вход. Проверьте учётную запись и пароль приложения SMTP.',
    ETIMEDOUT: 'Почтовый сервер не ответил вовремя.',
    ECONNECTION: 'Не удалось подключиться к почтовому серверу.',
    ECONNREFUSED: 'Почтовый сервер отклонил подключение.',
    ESOCKET: 'Соединение с почтовым сервером прервано.',
    EDNS: 'Не удалось найти почтовый сервер.',
    EREJECTED: 'Почтовый сервер не принял письмо.',
    EENVELOPE: 'Проверьте адрес отправителя и получателя.',
}
export function LeadDetail({
    initial,
    mailDeliveryEnabled,
    returnTo,
}: {
    initial: AdminLead
    mailDeliveryEnabled: boolean
    returnTo: string
}) {
    const [lead, setLead] = useState(initial)
    const [enabled, setEnabled] = useState(mailDeliveryEnabled)
    const [pending, setPending] = useState(false)
    const [confirm, setConfirm] = useState<'delete' | 'retry' | null>(null)
    const [error, setError] = useState<ApiError | null>(null)
    const [notice, setNotice] = useState('')
    const mounted = useRef(false)
    const busy = useRef(false)
    const router = useRouter()
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])
    async function refresh() {
        const data = await apiRequest<{ lead: AdminLead; mailDeliveryEnabled: boolean }>(
            '/api/admin/leads/' + lead.id,
        )
        if (mounted.current) {
            setLead(data.lead)
            setEnabled(data.mailDeliveryEnabled)
        }
    }
    async function act(action: 'refresh' | 'delete' | 'retry' | LeadStatus) {
        if (busy.current) return
        busy.current = true
        setPending(true)
        setError(null)
        setNotice('')
        try {
            if (action === 'refresh') await refresh()
            else if (action === 'delete') {
                await apiRequest('/api/admin/leads/' + lead.id, { method: 'DELETE' })
                if (mounted.current) router.replace(returnTo)
                return
            } else {
                const updated = await apiRequest<AdminLead>('/api/admin/leads/' + lead.id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        action === 'retry'
                            ? { retry: true }
                            : { status: action, expectedStatus: lead.status },
                    ),
                })
                if (mounted.current) setLead(updated)
            }
            if (mounted.current)
                setNotice(
                    action === 'refresh'
                        ? 'Данные обновлены.'
                        : action === 'retry'
                          ? 'Письмо возвращено в очередь. Отправка выполняется автоматически.'
                          : 'Статус заявки сохранён.',
                )
        } catch (cause) {
            if (!mounted.current) return
            setError(
                cause instanceof ApiError
                    ? cause
                    : new ApiError('Не удалось выполнить действие. Проверьте соединение и повторите.', 0),
            )
            if (cause instanceof ApiError && cause.status === 409) await refresh().catch(() => {})
        } finally {
            busy.current = false
            if (mounted.current) {
                setPending(false)
                setConfirm(null)
            }
        }
    }
    const unavailable = error?.status === 404 || error?.status === 401
    return (
        <>
            <Link href={returnTo} className="admin-back">
                ← К заявкам
            </Link>
            <div className="admin-titlebar">
                <div>
                    <p className="admin-caption">Заявка · {adminDate(lead.created_at)}</p>
                    <h1>{lead.payload.user_name}</h1>
                    <p className="admin-muted">{lead.payload.form_name}</p>
                </div>
                <button className="admin-button" disabled={pending} onClick={() => void act('refresh')}>
                    {pending ? 'Подождите…' : 'Обновить'}
                </button>
            </div>
            <div className="admin-feedback" aria-live="polite">
                {notice && (
                    <p role="status" className="admin-success-message">
                        {notice}
                    </p>
                )}
                {error && (
                    <div role="alert" className="admin-notice">
                        <p>{error.message}</p>
                        {error.status === 401 && (
                            <Link
                                className="admin-button"
                                href="/auth/signin"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Войти в отдельной вкладке ↗
                            </Link>
                        )}
                    </div>
                )}
            </div>
            <div className="admin-detail-grid">
                <div className="admin-detail-main">
                    <section className="admin-panel">
                        <h2>Контакты клиента</h2>
                        <a href={phoneHref(lead.payload.user_phone)} className="admin-contact-phone">
                            {lead.payload.user_phone}
                        </a>
                        {lead.payload.user_city && <p>{lead.payload.user_city}</p>}
                        <p className="admin-muted">Нажмите на номер, чтобы позвонить клиенту.</p>
                    </section>
                    <section className="admin-panel">
                        <h2>Обращение</h2>
                        <dl className="admin-data-list">
                            {Object.entries(leadFieldLabels)
                                .filter(
                                    ([key]) =>
                                        !['user_name', 'user_phone', 'user_city'].includes(key) &&
                                        lead.payload[key],
                                )
                                .map(([key, label]) => (
                                    <div key={key}>
                                        <dt>{label}</dt>
                                        <dd>{lead.payload[key]}</dd>
                                    </div>
                                ))}
                        </dl>
                    </section>
                    <section className="admin-panel">
                        <h2>Обработка заявки</h2>
                        <p className="admin-muted">Рабочий статус не зависит от отправки письма.</p>
                        <div className="admin-status-control">
                            <Field name="lead-status" label="Статус заявки">
                                <select
                                    id="lead-status"
                                    name="status"
                                    disabled={pending || unavailable}
                                    value={lead.status}
                                    onChange={(e) => void act(e.target.value as LeadStatus)}
                                >
                                    {Object.entries(leadStatusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <LeadStatusBadge status={lead.status} />
                        </div>
                    </section>
                    <details className="admin-panel admin-technical">
                        <summary>Служебные данные и согласие</summary>
                        <dl className="admin-data-list">
                            <div>
                                <dt>Номер заявки</dt>
                                <dd>{lead.id}</dd>
                            </div>
                            <div>
                                <dt>Согласие получено</dt>
                                <dd>{adminDate(lead.consent_at)}</dd>
                            </div>
                            <div>
                                <dt>Версия согласия</dt>
                                <dd>{lead.consent_version}</dd>
                            </div>
                        </dl>
                        <button
                            className="admin-button admin-button-danger"
                            disabled={pending || unavailable}
                            onClick={() => setConfirm('delete')}
                        >
                            Удалить заявку
                        </button>
                    </details>
                </div>
                <aside className="admin-detail-aside" aria-label="Отправка письма">
                    <section className="admin-panel">
                        <h2>Отправка письма</h2>
                        <MailStatusBadge lead={lead} enabled={enabled} />
                        <dl className="admin-data-list">
                            <div>
                                <dt>Неудачных попыток</dt>
                                <dd>{lead.attempts}</dd>
                            </div>
                            {lead.sent_at && (
                                <div>
                                    <dt>Принято сервером</dt>
                                    <dd>{adminDate(lead.sent_at)}</dd>
                                </div>
                            )}
                            {enabled && lead.mail_status === 'pending' && (
                                <div>
                                    <dt>Следующая попытка</dt>
                                    <dd>{adminDate(lead.next_attempt_at)}</dd>
                                </div>
                            )}
                        </dl>
                        {lead.last_error && (
                            <div className="admin-notice">
                                <p>
                                    {mailErrors[lead.last_error] ||
                                        'Не удалось отправить письмо. Проверьте настройки SMTP.'}
                                </p>
                                <p className="admin-caption">Код: {lead.last_error}</p>
                            </div>
                        )}
                        {lead.mail_status === 'pending' && (
                            <p className="admin-muted">
                                {enabled
                                    ? 'Очередь обрабатывается автоматически. При временной ошибке система повторит попытку.'
                                    : 'Отправка начнётся после настройки SMTP и включения почты. Сейчас письмо не отправляется.'}
                            </p>
                        )}
                        {lead.mail_status === 'sent' && (
                            <p className="admin-muted">
                                Письмо принято почтовым сервером. Это не подтверждает его прочтение или
                                дальнейшую пересылку.
                            </p>
                        )}
                        {lead.mail_status === 'failed' && (
                            <>
                                <p className="admin-muted">
                                    Автоматические попытки исчерпаны. Исправьте настройки SMTP перед повтором.
                                </p>
                                <button
                                    className="admin-button"
                                    disabled={pending || !enabled || unavailable}
                                    onClick={() => setConfirm('retry')}
                                >
                                    Повторить отправку
                                </button>
                                {!enabled && (
                                    <p className="admin-muted">
                                        Повтор станет доступен после включения почты.
                                    </p>
                                )}
                            </>
                        )}
                    </section>
                    <MailMode enabled={enabled} />
                </aside>
            </div>
            <p className="admin-footnote">Время — Владивосток.</p>
            <ConfirmDialog
                open={confirm !== null}
                title={
                    confirm === 'delete'
                        ? `Удалить заявку ${lead.payload.user_name}?`
                        : 'Повторить отправку письма?'
                }
                description={
                    confirm === 'delete'
                        ? 'Заявка, персональные данные клиента и задание на отправку будут удалены без возможности восстановления в админке.'
                        : 'Письмо вернётся в очередь. Счётчик неудачных попыток начнётся заново. Убедитесь, что настройки SMTP исправлены.'
                }
                confirmLabel={confirm === 'delete' ? 'Удалить заявку' : 'Вернуть в очередь'}
                pending={pending}
                onClose={() => setConfirm(null)}
                onConfirm={() => void act(confirm === 'delete' ? 'delete' : 'retry')}
            />
        </>
    )
}
