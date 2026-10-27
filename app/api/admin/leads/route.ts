import { requireAdmin, apiError } from '@/shared/lib/server/http'
import { database } from '@/shared/lib/server/db'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    try {
        await requireAdmin()
        const page = Math.max(
            0,
            Math.min(
                100000,
                Number(new URL(request.url).searchParams.get('page')) || 0
            )
        )
        const { rows } = await database().query(
            `SELECT l.id,l.payload,l.status,l.created_at,o.status AS mail_status,o.attempts,o.last_error FROM leads l LEFT JOIN mail_outbox o ON o.lead_id=l.id ORDER BY l.created_at DESC,l.id LIMIT 50 OFFSET $1`,
            [Math.floor(page) * 50]
        )
        return Response.json(
            { leads: rows },
            { headers: { 'Cache-Control': 'no-store' } }
        )
    } catch (error) {
        return apiError(error)
    }
}
