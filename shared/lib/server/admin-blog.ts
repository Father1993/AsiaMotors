import 'server-only'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { getAllPosts } from '@/shared/utils/posts'
import type { Post } from '@/shared/types/common'

export async function missingPostImages(post: Post) {
    const urls = [
        ...new Set([
            post.image,
            ...Array.from(post.content.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi), (match) => match[1]),
        ]),
    ].filter((url) => url.startsWith('/posts/'))
    const missing = await Promise.all(
        urls.map(async (url) => {
            try {
                // Public assets are explicitly copied into the image; do not trace the working directory.
                await access(/* turbopackIgnore: true */ path.join(process.cwd(), 'public', url))
                return null
            } catch {
                return url
            }
        }),
    )
    return missing.filter((url): url is string => url !== null)
}
export async function adminBlogPosts() {
    return Promise.all(
        (await getAllPosts()).map(async (post) => ({
            ...post,
            missingImages: await missingPostImages(post),
        })),
    )
}
export function adminPostContent(post: Post, missing: string[]) {
    return post.content.replace(/<img\b[^>]*>/gi, (tag) => {
        const source = /\bsrc="([^"]+)"/i.exec(tag)?.[1]
        return source && missing.includes(source)
            ? '<p class="admin-image-missing">Изображение отсутствует в файлах сайта.</p>'
            : tag
    })
}
