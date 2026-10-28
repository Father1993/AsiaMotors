import { leadStatusLabels, mailLabel, type AdminLead, type LeadStatus } from '@/shared/lib/leads'
export function LeadStatusBadge({ status }: { status: LeadStatus }) {
    const tone = status === 'new' ? 'info' : status === 'processing' ? 'warning' : 'neutral'
    return <span className={'admin-badge admin-badge-' + tone}>{leadStatusLabels[status]}</span>
}
export function MailStatusBadge({ lead, enabled }: { lead: AdminLead; enabled: boolean }) {
    const tone =
        lead.mail_status === 'sent' ? 'published' : lead.mail_status === 'failed' ? 'danger' : 'neutral'
    return <span className={'admin-badge admin-badge-' + tone}>{mailLabel(lead, enabled)}</span>
}
export function MailMode({ enabled, pending }: { enabled: boolean; pending?: number }) {
    return (
        <section className="admin-mail-mode" aria-label="Режим отправки почты">
            <span className={'admin-badge admin-badge-' + (enabled ? 'published' : 'neutral')}>
                {enabled ? 'Отправка почты включена' : 'Отправка почты выключена'}
            </span>
            <p>
                {enabled
                    ? 'Письма отправляются автоматически. «Принято почтовым сервером» не подтверждает прочтение письма.'
                    : 'Заявки сохраняются здесь. После настройки SMTP и включения отправки накопленная очередь будет обработана автоматически.'}
            </p>
            {pending !== undefined && pending > 0 && (
                <p className="admin-muted">
                    Ожидают отправки: <strong>{pending}</strong>
                </p>
            )}
        </section>
    )
}
