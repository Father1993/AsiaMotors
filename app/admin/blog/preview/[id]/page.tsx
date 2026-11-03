import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/shared/lib/server/http'
import { getAdminPost } from '@/shared/lib/server/posts'
import PostArticle from '@/components/blog/PostArticle'
export const metadata = {
    title: 'Предпросмотр статьи | AsiaMotors',
    robots: { index: false, follow: false },
}
export default async function Preview({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireAdmin()
    const { id } = await params
    if (!/^[0-9a-f-]{36}$/.test(id)) notFound()
    const post = await getAdminPost(id).catch((error) => {
        if (error.status === 404) notFound()
        throw error
    })
    return (
        <>
            <Link href={'/admin/blog/edit/' + post.id} className="admin-back">
                ← К редактированию
            </Link>
            <p className="admin-readonly-note">
                Предпросмотр сохранённого черновика. Посетители видят только
                опубликованную версию.
            </p>
            <PostArticle
                document={post.draft}
                slug={post.slug}
                publishedAt={post.published_at || post.created_at}
                updatedAt={post.publication_updated_at || undefined}
                preview
            />
        </>
    )
}
