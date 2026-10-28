import { readFileSync, readdirSync, existsSync } from 'node:fs'
import matter from 'gray-matter'
import { test, expect } from '@playwright/test'
import { login } from './helpers'
const slugs = readdirSync('public/posts')
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.slice(0, -4))

test('blog: all existing articles remain available, navigation, search and responsive reading', async ({
    page,
    context,
}) => {
    await login(context)
    await page.goto('/admin/blog')
    await expect(page.getByRole('link', { name: 'Блог', exact: true })).toHaveAttribute(
        'aria-current',
        'page',
    )
    await expect(page.getByText(`${slugs.length} опубликованных статей · просмотр материалов`)).toBeVisible()
    await expect(page.getByText('Сейчас доступен просмотр статей.', { exact: false })).toBeVisible()
    await expect(page.locator('.admin-blog-card')).toHaveCount(12)
    for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        expect(await page.locator('html').evaluate((el) => el.scrollWidth <= window.innerWidth)).toBe(true)
        await page.screenshot({ path: `/tmp/asiamotors-admin-blog-${width}.png`, fullPage: true })
    }
    await page.getByRole('link', { name: 'Далее →' }).click()
    await expect(page).toHaveURL(/page=2/)
    await page
        .getByRole('link', { name: /^Читать/ })
        .first()
        .click()
    await expect(page.locator('.admin-article-content')).not.toBeEmpty()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    await page.getByRole('link', { name: '← К статьям' }).click()
    await expect(page).toHaveURL(/page=2/)
    await page.getByLabel('Название, тема или автор').fill('BYD Song Pro')
    await page.getByRole('button', { name: 'Найти', exact: true }).click()
    await expect(
        page.getByRole('link', { name: 'BYD Song Pro: Держим планку до конца!', exact: true }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'BYD Song Pro: Держим планку до конца!', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('BYD Song Pro: Держим планку до конца!')
    await expect(page.getByRole('link', { name: 'Открыть на сайте ↗' })).toHaveAttribute(
        'href',
        '/blog/BYD-Song-Pro',
    )
    for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        expect(await page.locator('html').evaluate((el) => el.scrollWidth <= window.innerWidth)).toBe(true)
        await page.screenshot({ path: `/tmp/asiamotors-admin-article-${width}.png`, fullPage: true })
    }
    const publicResponse = await context.request.get('/blog/BYD-Song-Pro')
    expect(publicResponse.status()).toBe(200)
    expect(await publicResponse.text()).toContain('BYD Song Pro: Держим планку до конца!')
    await page.getByRole('link', { name: '← К статьям' }).click()
    await expect(page.getByLabel('Название, тема или автор')).toHaveValue('BYD Song Pro')
    await page.getByLabel('Название, тема или автор').fill('no-article-matches-please')
    await page.getByRole('button', { name: 'Найти', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Статьи не найдены' })).toBeVisible()
    await page.getByRole('link', { name: 'Сбросить', exact: true }).click()
    await expect(page.getByLabel('Название, тема или автор')).toHaveValue('')
    await expect(page.locator('.admin-blog-card')).toHaveCount(12)
})

test('blog: admin reading and original public URLs resolve every source article', async ({
    context,
    playwright,
}) => {
    await login(context)
    for (const slug of slugs) {
        const source = readFileSync('public/posts/' + slug + '.mdx', 'utf8')
        const { data } = matter(source)
        expect(existsSync('public' + data.image), slug + ': cover').toBe(true)
        for (const prefix of ['/admin/blog/', '/blog/']) {
            const response = await context.request.get(prefix + encodeURIComponent(slug))
            expect(response.status(), prefix + slug).toBe(200)
            expect(await response.text()).toContain(
                String(data.title)
                    .replaceAll('&', '&amp;')
                    .replaceAll('<', '&lt;')
                    .replaceAll('>', '&gt;')
                    .replaceAll('\"', '&quot;')
                    .replaceAll("'", '&#x27;'),
            )
        }
    }
    const missing = await context.request.get('/admin/blog/duel-avatr-vs-xiaomi')
    const missingBody = await missing.text()
    expect(missingBody).toContain('Изображение отсутствует в файлах сайта.')
    expect(missingBody).toContain('Недоступно изображений:')
    expect((await context.request.get('/admin/blog/not-an-existing-article')).status()).toBe(404)
    const anonymous = await playwright.request.newContext({ baseURL: 'http://127.0.0.1:3110' })
    try {
        const response = await anonymous.get('/admin/blog', { maxRedirects: 0 })
        expect([302, 307]).toContain(response.status())
        expect(response.headers().location).toContain('/auth/signin')
    } finally {
        await anonymous.dispose()
    }
})
