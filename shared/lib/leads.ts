export const leadStatusLabels = { new: 'Новая', processing: 'В работе', closed: 'Закрыта' } as const
export type LeadStatus = keyof typeof leadStatusLabels
export type MailStatus = 'pending' | 'sent' | 'failed'
export const formNames = [
    'Форма расчета стоимости',
    'Форма специального предложения',
    'Форма вопроса',
    'Форма заказа автомобиля',
    'Форма консультации',
    'Форма заказа запчастей',
] as const
export const leadFieldLabels: Record<string, string> = {
    form_name: 'Форма',
    user_name: 'Имя',
    user_phone: 'Телефон',
    user_city: 'Город',
    car_model: 'Автомобиль',
    message: 'Сообщение',
    car_year: 'Год',
    vin_number: 'VIN',
    part_name: 'Запчасть',
    part_number: 'Артикул',
}
export type AdminLead = {
    id: string
    payload: Record<string, string>
    status: LeadStatus
    created_at: string
    consent_version: string
    consent_at: string
    mail_status: MailStatus | null
    attempts: number
    last_error: string | null
    next_attempt_at: string | null
    sent_at: string | null
}
export type LeadsResult = {
    leads: AdminLead[]
    total: number
    page: number
    pageSize: number
    summary: Record<LeadStatus, number> & { pending: number; failed: number }
    mailDeliveryEnabled: boolean
}
export function mailLabel(lead: AdminLead, enabled: boolean) {
    if (lead.mail_status === 'sent') return 'Принято почтовым сервером'
    if (lead.mail_status === 'failed') return 'Ошибка отправки'
    if (!lead.mail_status) return 'Нет задания на отправку'
    if (!enabled) return 'Ожидает включения почты'
    return lead.attempts ? 'Повтор по расписанию' : 'В очереди'
}
export function phoneHref(phone: string) {
    const digits = phone.replace(/\D/g, '')
    return 'tel:+' + (digits.length === 11 && digits.startsWith('8') ? '7' + digits.slice(1) : digits)
}
