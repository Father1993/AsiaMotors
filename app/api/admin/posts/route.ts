import { requireAdmin, apiError, readJson } from "@/shared/lib/server/http";
import { listAdminPosts, savePost } from "@/shared/lib/server/posts";
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json(
      await listAdminPosts(new URL(request.url).searchParams),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    return Response.json(await savePost(await readJson(request, 1024 * 1024)), {
      status: 201,
    });
  } catch (e) {
    return apiError(e);
  }
}
