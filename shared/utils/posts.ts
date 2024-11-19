import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Post } from '@/shared/types/common' // Добавляем импорт типа Post

const postsDirectory = path.join(process.cwd(), 'public', 'posts')

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`)
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
            slugs
                // Изменяем фильтр для .mdx файлов
                .filter((fileName) => fileName.endsWith('.mdx'))
                .map(async (fileName) => {
                    // Изменяем замену расширения
                    const slug = fileName.replace(/\.mdx$/, '')
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
        // Изменяем фильтр и замену расширения для .mdx файлов
        return fileNames
            .filter((fileName) => fileName.endsWith('.mdx'))
            .map((fileName) => fileName.replace(/\.mdx$/, ''))
    } catch (error) {
        console.error('Error loading post slugs:', error)
        return []
    }
}
