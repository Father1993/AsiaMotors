import { requireAdmin, apiError } from "@/shared/lib/server/http";
import { getDashboard } from "@/shared/lib/server/dashboard";
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json(
      await getDashboard(
        new URL(request.url).searchParams.get("period") || undefined,
      ),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
