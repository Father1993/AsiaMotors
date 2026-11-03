import { requireAdmin, apiError, readJson } from "@/shared/lib/server/http";
import {
  getAdminPost,
  savePost,
  changePostStatus,
  deletePost,
} from "@/shared/lib/server/posts";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    await requireAdmin(request);
    return Response.json(await getAdminPost((await params).id), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
export async function PUT(request: Request, { params }: Context) {
  try {
    await requireAdmin(request);
    return Response.json(
      await savePost(await readJson(request, 1024 * 1024), (await params).id),
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    await requireAdmin(request);
    return Response.json(
      await changePostStatus(
        (await params).id,
        await readJson(request, 1024 * 1024),
      ),
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    await requireAdmin(request);
    return Response.json(
      await deletePost((await params).id, await readJson(request, 1024 * 1024)),
    );
  } catch (e) {
    return apiError(e);
  }
}
