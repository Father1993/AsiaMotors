import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Post } from '@/shared/types/common' // Добавляем импорт типа Post

const postsDirectory = path.join(process.cwd(), 'public', 'posts')

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`)
        const fileContents = await fs.promises.readFile(fullPath, 'utf8')

        // Используем gray-matter для парсинга frontmatter
        const { data, content } = matter(fileContents)

        // Преобразуем markdown в HTML
        const processedContent = await remark()
            .use(html, { sanitize: false }) // sanitize: false позволяет использовать HTML в markdown
            .process(content)
        const contentHtml = processedContent.toString()

        return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            content: contentHtml, // Теперь контент в формате HTML
            date: data.date,
            author: data.author,
            image: data.image,
            readingTime: data.readingTime,
            tags: data.tags || [],
        }
    } catch (error) {
        console.error(`Error loading post ${slug}:`, error)
        return null
    }
}

export async function getAllPosts(): Promise<Post[]> {
    try {
        const slugs = await fs.promises.readdir(postsDirectory)
        const posts = await Promise.all(
            slugs.map(async (fileName) => {
                const slug = fileName.replace(/\.md$/, '')
                return getPostBySlug(slug)
            })
        )

        return posts
            .filter((post): post is Post => post !== null)
            .sort(
                (post1, post2) =>
                    new Date(post2.date).getTime() -
                    new Date(post1.date).getTime()
            )
    } catch (error) {
        console.error('Error loading posts:', error)
        return []
    }
}

export async function getAllPostSlugs(): Promise<string[]> {
    try {
        const fileNames = await fs.promises.readdir(postsDirectory)
        return fileNames.map((fileName) => fileName.replace(/\.md$/, ''))
    } catch (error) {
        console.error('Error loading post slugs:', error)
        return []
    }
}
