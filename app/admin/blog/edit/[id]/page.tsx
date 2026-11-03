import { notFound } from 'next/navigation'
import { z } from 'zod'
import { PostEditor } from '@/components/admin/PostEditor'
import { getAdminPost } from '@/shared/lib/server/posts'
import { requireAdmin, HttpError } from '@/shared/lib/server/http'
import { adminReturnTo } from '@/shared/lib/admin-navigation'
export const metadata = { title: 'Редактирование статьи | AsiaMotors' }
export default async function EditPost({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ returnTo?: string }>
}) {
    await requireAdmin()
    const { id } = await params
    if (!z.uuid().safeParse(id).success) notFound()
    const post = await getAdminPost(id).catch((error) => {
        if (error instanceof HttpError && error.status === 404) notFound()
        throw error
    })
    return (
        <PostEditor
            key={id}
            post={post}
            returnTo={adminReturnTo(
                (await searchParams).returnTo,
                '/admin/blog',
            )}
        />
    )
}
