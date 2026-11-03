import { PostEditor } from '@/components/admin/PostEditor'
import { requireAdmin } from '@/shared/lib/server/http'
import { adminReturnTo } from '@/shared/lib/admin-navigation'
export const metadata = { title: 'Новая статья | AsiaMotors' }
export default async function NewPost({
    searchParams,
}: {
    searchParams: Promise<{ returnTo?: string }>
}) {
    await requireAdmin()
    return (
        <PostEditor
            returnTo={adminReturnTo(
                (await searchParams).returnTo,
                '/admin/blog',
            )}
        />
    )
}
