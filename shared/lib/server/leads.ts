import 'server-only'
import { z } from 'zod'
import { database } from './db'
import { HttpError } from './http'
import { formNames, type AdminLead, type LeadsResult } from '../leads'

export const mailDeliveryEnabled = () => process.env.MAIL_DELIVERY_ENABLED === 'true'
const selection = `l.id,l.payload,l.status,l.created_at,l.consent_version,l.consent_at,
    o.status AS mail_status,COALESCE(o.attempts,0) AS attempts,o.last_error,o.next_attempt_at,o.sent_at`
const joined = `FROM leads l LEFT JOIN mail_outbox o ON o.lead_id=l.id`
export async function getAdminLead(id: string) {
    const result = await database().query(`SELECT ${selection} ${joined} WHERE l.id=$1`, [id])
    if (!result.rows[0]) throw new HttpError(404, 'Заявка не найдена')
    return JSON.parse(JSON.stringify(result.rows[0])) as AdminLead
}
export async function listAdminLeads(params: URLSearchParams): Promise<LeadsResult> {
    const filters = z
        .object({
            q: z.string().trim().max(150).default(''),
            status: z.enum(['new', 'processing', 'closed']).optional(),
            mail: z.enum(['pending', 'sent', 'failed']).optional(),
            form: z.enum(formNames).optional(),
            page: z.coerce.number().int().min(1).max(1000000).default(1),
        })
        .parse(Object.fromEntries(params))
    const values: unknown[] = []
    const conditions: string[] = []
    for (const [column, value] of [
        ['l.status', filters.status],
        ['o.status', filters.mail],
        ["l.payload->>'form_name'", filters.form],
    ]) {
        if (value !== undefined) {
            values.push(value)
            conditions.push(`${column}=$${values.length}`)
        }
    }
    if (filters.q) {
        const term = filters.q.replace(/[\\%_]/g, '\\$&')
        values.push('%' + term + '%')
        let search = `concat_ws(' ',l.payload->>'user_name',l.payload->>'user_phone',l.payload->>'car_model',l.payload->>'part_name',l.payload->>'vin_number') ILIKE $${values.length}`
        const digits = filters.q.replace(/\D/g, '')
        if (digits.length >= 4 && /^[+\d\s()-]+$/.test(filters.q)) {
            values.push('%' + digits + '%')
            search += ` OR regexp_replace(l.payload->>'user_phone','[^0-9]','','g') LIKE $${values.length}`
        }
        conditions.push('(' + search + ')')
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''
    const { rows } = await database().query(
        `WITH filtered AS (SELECT ${selection} ${joined} ${where})
        SELECT (SELECT count(*)::int FROM filtered) AS total,
        COALESCE((SELECT jsonb_agg(p) FROM (SELECT * FROM filtered ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET $${values.length + 1}) p),'[]'::jsonb) AS leads,
        (SELECT jsonb_build_object('new',count(*) FILTER(WHERE l.status='new'),
            'processing',count(*) FILTER(WHERE l.status='processing'),'closed',count(*) FILTER(WHERE l.status='closed'),
            'pending',count(*) FILTER(WHERE o.status='pending'),'failed',count(*) FILTER(WHERE o.status='failed')) ${joined}) AS summary`,
        [...values, (filters.page - 1) * 25],
    )
    return { ...rows[0], page: filters.page, pageSize: 25, mailDeliveryEnabled: mailDeliveryEnabled() }
}
export async function updateAdminLead(id: string, input: unknown) {
    const data = z
        .union([
            z
                .object({
                    status: z.enum(['new', 'processing', 'closed']),
                    expectedStatus: z.enum(['new', 'processing', 'closed']).optional(),
                })
                .strict(),
            z.object({ retry: z.literal(true) }).strict(),
        ])
        .parse(input)
    let result
    if ('status' in data) {
        result = await database().query(
            `UPDATE leads SET status=$2 WHERE id=$1 AND ($3::text IS NULL OR status=$3) RETURNING id`,
            [id, data.status, data.expectedStatus ?? null],
        )
    } else {
        if (!mailDeliveryEnabled())
            throw new HttpError(
                409,
                'Отправка почты выключена. Повтор станет доступен после настройки SMTP и включения отправки.',
            )
        result = await database().query(
            `UPDATE mail_outbox SET status='pending',attempts=0,last_error=NULL,next_attempt_at=now()
            WHERE lead_id=$1 AND status='failed' RETURNING id`,
            [id],
        )
    }
    if (!result.rowCount) {
        await getAdminLead(id)
        throw new HttpError(
            409,
            'Заявка или отправка уже изменилась. Обновите данные перед повторным действием.',
        )
    }
    return getAdminLead(id)
}
