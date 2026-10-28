import { requireAdmin, apiError } from '@/shared/lib/server/http'
import { listAdminLeads } from '@/shared/lib/server/leads'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    try {
        await requireAdmin()
        return Response.json(await listAdminLeads(new URL(request.url).searchParams), {
            headers: { 'Cache-Control': 'no-store' },
        })
    } catch (error) {
        return apiError(error)
    }
}
