import 'server-only'
import { createHmac } from 'node:crypto'
import { database } from './db'
export async function allowLogin(request: Request) {
    const ip = request.headers.get('x-real-ip') || 'local'
    const key =
        'login:' +
        createHmac('sha256', process.env.NEXTAUTH_SECRET!)
            .update(ip)
            .digest('hex')
    const result = await database().query(
        `INSERT INTO request_limits(key,window_start,hits) VALUES($1,date_bin('15 minutes',now(),'2000-01-01'::timestamptz),1)
      ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN request_limits.window_start=EXCLUDED.window_start THEN request_limits.hits+1 ELSE 1 END,window_start=EXCLUDED.window_start RETURNING hits`,
        [key]
    )
    return result.rows[0].hits <= 15
}
