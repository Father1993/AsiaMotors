import { createHmac } from 'node:crypto'
import { database } from '@/shared/lib/server/db'
import {
    checkOrigin,
    readJson,
    apiError,
    HttpError,
} from '@/shared/lib/server/http'
import { leadInput } from '@/shared/lib/server/validation'
export async function POST(request: Request) {
    try {
        checkOrigin(request)
        const input = leadInput.parse(await readJson(request))
        if (input.website)
            throw new HttpError(400, 'Проверьте заполнение формы')
        const { request_key, consent_version, consent, website, ...payload } =
            input
        void consent
        void website
        const client = await database().connect()
        try {
            await client.query('BEGIN')
            // The edge proxy overwrites this header. Raw IPs are never persisted.
            const ip = request.headers.get('x-real-ip') || 'local'
            const key = createHmac('sha256', process.env.NEXTAUTH_SECRET!)
                .update(ip)
                .digest('hex')
            for (const [bucket, limit] of [
                [key, 5],
                ['global', 100],
            ] as const) {
                const result = await client.query(
                    `INSERT INTO request_limits(key,window_start,hits) VALUES($1,date_bin('15 minutes',now(),'2000-01-01'::timestamptz),1)
                ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN request_limits.window_start=EXCLUDED.window_start THEN request_limits.hits+1 ELSE 1 END,window_start=EXCLUDED.window_start RETURNING hits`,
                    [bucket]
                )
                if (result.rows[0].hits > limit)
                    throw new HttpError(
                        429,
                        'Слишком много заявок. Повторите через 15 минут.'
                    )
            }
            const result = await client.query(
                `INSERT INTO leads(request_key,payload,consent_version) VALUES($1,$2,$3) ON CONFLICT(request_key) DO NOTHING RETURNING id`,
                [request_key, JSON.stringify(payload), consent_version]
            )
            if (result.rows[0])
                await client.query(
                    'INSERT INTO mail_outbox(lead_id) VALUES($1)',
                    [result.rows[0].id]
                )
            await client.query('COMMIT')
            return Response.json({ ok: true }, { status: 202 })
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    } catch (error) {
        return apiError(error)
    }
}
