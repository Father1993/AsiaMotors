import { getBlogPosts, blogSummary } from '@/shared/lib/server/blog'
import NewsCards from './NewsCards'
export default async function News() {
    const posts = (await getBlogPosts()).slice(0, 3).map(blogSummary)
    return <NewsCards posts={posts} />
}
