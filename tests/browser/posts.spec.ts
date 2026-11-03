import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import { test, expect } from '@playwright/test'
import { login } from './helpers'
const db = new pg.Pool({
    host: '127.0.0.1',
    port: 35432,
    database: 'asiamotors',
    user: 'asiamotors',
    password: readFileSync('.secrets/db_app_password', 'utf8').trim(),
    max: 1,
})
test.afterAll(async () => db.end())
test('posts: manager creates, previews and publishes an article while draft edits stay private', async ({
    page,
    context,
}) => {
    test.setTimeout(120000)
    await login(context)
    const title = 'Сравнение автомобилей из Китая ' + randomUUID().slice(0, 8)
    let id = ''
    try {
        await page.goto('/admin/blog/new')
        await page.getByLabel('Заголовок статьи', { exact: true }).fill(title)
        await expect
            .poll(() =>
                page.evaluate(() =>
                    Object.keys(sessionStorage).some((key) =>
                        key.startsWith('asiamotors:post:'),
                    ),
                ),
            )
            .toBe(true)
        page.once('dialog', (dialog) => dialog.accept())
        await page.reload()
        await expect(
            page.getByRole('heading', { name: 'Есть несохранённый текст' }),
        ).toBeVisible()
        await page
            .getByRole('button', { name: 'Восстановить', exact: true })
            .click()
        await expect(
            page.getByLabel('Заголовок статьи', { exact: true }),
        ).toHaveValue(title)
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(page.getByRole('status')).toContainText('сохранён')
        id = new URL(page.url()).pathname.split('/').pop()!
        const slug = await page
            .getByLabel('Адрес страницы', { exact: true })
            .inputValue()
        expect((await context.request.get('/blog/' + slug)).status()).toBe(404)
        await page
            .getByLabel('Краткое описание', { exact: true })
            .fill(
                'Сравниваем оснащение, стоимость и условия заказа новых автомобилей из Китая.',
            )
        await page
            .getByLabel('Что изображено на обложке (alt)', { exact: true })
            .fill('Автомобиль из Китая')
        await page.getByLabel('Файл обложки', { exact: true }).setInputFiles({
            name: 'cover.png',
            mimeType: 'image/png',
            buffer: readFileSync('public/img/android-chrome-192x192.png'),
        })
        await expect(page.locator('.post-cover-preview img')).toBeVisible()
        await page
            .getByRole('textbox', { name: 'Текст статьи', exact: true })
            .fill(
                'Первый опубликованный текст. Сравниваем комплектации, привод и стоимость доставки автомобиля из Китая во Владивосток.',
            )
        await page.locator('summary', { hasText: 'Таблица сравнения' }).click()
        await page
            .getByRole('button', { name: 'Вставить таблицу 3 × 3' })
            .click()
        await expect(page.locator('.post-rich-content table')).toHaveCount(1)
        await page.locator('.post-rich-content th').first().click()
        await page.keyboard.type('Комплектация')
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByText('Все изменения сохранены', { exact: true }),
        ).toBeVisible()
        for (const width of [390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            await page.evaluate(() => window.scrollTo(0, 0))
            expect(
                await page
                    .locator('html')
                    .evaluate((el) => el.scrollWidth <= window.innerWidth),
            ).toBe(true)
            await page.screenshot({
                path: `/tmp/asiamotors-post-editor-${width}.png`,
                fullPage: false,
            })
        }
        const preview = await context.request.get('/admin/blog/preview/' + id)
        expect(preview.status()).toBe(200)
        expect(await preview.text()).toContain('Комплектация')
        await page
            .getByRole('button', { name: 'Опубликовать', exact: true })
            .click()
        await expect(page.getByRole('status')).toHaveText('Статья опубликована')
        let response = await context.request.get('/blog/' + slug)
        expect(response.status()).toBe(200)
        expect(await response.text()).toContain('Первый опубликованный текст')
        await page
            .getByRole('textbox', { name: 'Текст статьи', exact: true })
            .fill(
                'Только черновик: изменённая версия статьи ещё не опубликована. Все основные характеристики автомобиля нужно проверить перед заказом.',
            )
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByText('Есть неопубликованные изменения', { exact: true }),
        ).toBeVisible()
        response = await context.request.get('/blog/' + slug)
        expect(await response.text()).toContain('Первый опубликованный текст')
        await page
            .getByRole('button', { name: 'Скрыть с сайта', exact: true })
            .click()
        await page
            .getByRole('dialog')
            .getByRole('button', { name: 'Скрыть', exact: true })
            .click()
        await expect(page.getByRole('status')).toHaveText(
            'Статья скрыта с сайта',
        )
        expect((await context.request.get('/blog/' + slug)).status()).toBe(404)
        await page
            .getByRole('button', { name: 'Вернуть на сайт', exact: true })
            .click()
        await page
            .getByRole('dialog')
            .getByRole('button', { name: 'Вернуть', exact: true })
            .click()
        await expect(page.getByRole('status')).toHaveText(
            'Статья возвращена на сайт',
        )
        response = await context.request.get('/blog/' + slug)
        expect(await response.text()).toContain('Первый опубликованный текст')
        await page
            .getByRole('button', {
                name: 'Опубликовать изменения',
                exact: true,
            })
            .click()
        await expect(page.getByRole('status')).toHaveText('Статья опубликована')
        expect(
            await (await context.request.get('/blog/' + slug)).text(),
        ).toContain('Только черновик:')
    } finally {
        // This connection is pinned to the isolated test PostgreSQL port, never production.
        if (id) await db.query('DELETE FROM posts WHERE id=$1', [id])
    }
})

test('posts: empty-title recovery and stale local edits cannot overwrite a newer server version', async ({
    page,
    context,
}) => {
    await login(context)
    let id = ''
    try {
        await page.goto('/admin/blog/new')
        const text =
            'Текст сначала, а заголовок менеджер добавит после подготовки материала об автомобиле.'
        await page
            .getByRole('textbox', { name: 'Текст статьи', exact: true })
            .fill(text)
        await expect
            .poll(() =>
                page.evaluate(() =>
                    Object.values(sessionStorage).some((value) =>
                        value.includes('Текст сначала'),
                    ),
                ),
            )
            .toBe(true)
        page.once('dialog', (dialog) => dialog.accept())
        await page.reload()
        await page
            .getByRole('button', { name: 'Восстановить', exact: true })
            .click()
        await expect(
            page.getByLabel('Заголовок статьи', { exact: true }),
        ).toHaveValue('')
        await expect(
            page.getByRole('textbox', { name: 'Текст статьи', exact: true }),
        ).toHaveText(text)
        const title = 'Черновик восстановления ' + randomUUID().slice(0, 8)
        await page.getByLabel('Заголовок статьи', { exact: true }).fill(title)
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByText('Все изменения сохранены', { exact: true }),
        ).toBeVisible()
        id = new URL(page.url()).pathname.split('/').pop()!
        const original = await (
            await context.request.get('/api/admin/posts/' + id)
        ).json()
        const localTitle = title + ' локальные правки'
        await page
            .getByLabel('Заголовок статьи', { exact: true })
            .fill(localTitle)
        await expect
            .poll(() =>
                page.evaluate(() =>
                    Object.values(sessionStorage).some((value) =>
                        value.includes('локальные правки'),
                    ),
                ),
            )
            .toBe(true)
        const external = await context.request.put('/api/admin/posts/' + id, {
            headers: { Origin: 'http://127.0.0.1:3110' },
            data: {
                version: original.version,
                slug: original.slug,
                document: {
                    ...original.draft,
                    title: title + ' другая вкладка',
                },
            },
        })
        expect(external.status()).toBe(200)
        page.once('dialog', (dialog) => dialog.accept())
        await page.reload()
        await page
            .getByRole('button', { name: 'Восстановить', exact: true })
            .click()
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByRole('link', {
                name: 'Открыть актуальную запись отдельно',
            }),
        ).toBeVisible()
        await expect(
            page.getByLabel('Заголовок статьи', { exact: true }),
        ).toHaveValue(localTitle)
        const unchanged = await (
            await context.request.get('/api/admin/posts/' + id)
        ).json()
        expect(unchanged.draft.title).toBe(title + ' другая вкладка')
    } finally {
        if (id) await db.query('DELETE FROM posts WHERE id=$1', [id])
    }
})

test('posts: a lost create response followed by new input keeps one record and retains the new text', async ({
    page,
    context,
}) => {
    await login(context)
    let id = ''
    try {
        await page.goto('/admin/blog/new')
        const title = 'Потерянный ответ ' + randomUUID().slice(0, 8)
        await page.getByLabel('Заголовок статьи', { exact: true }).fill(title)
        await page.route('**/api/admin/posts', async (route) => {
            if (route.request().method() !== 'POST') return route.continue()
            id = route.request().postDataJSON().id
            await route.fetch()
            await route.abort('failed')
        })
        await page.route('**/api/admin/posts/*', (route) =>
            route.abort('failed'),
        )
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(page.locator('#post-problem')).toBeVisible()
        const changed = title + ' с новыми правками'
        await page.getByLabel('Заголовок статьи', { exact: true }).fill(changed)
        await page.unroute('**/api/admin/posts')
        await page.unroute('**/api/admin/posts/*')
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(page.getByRole('status')).toContainText(
            'Запись уже создана предыдущей попыткой',
        )
        await expect(
            page.getByLabel('Заголовок статьи', { exact: true }),
        ).toHaveValue(changed)
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByText('Все изменения сохранены', { exact: true }),
        ).toBeVisible()
        const stored = await (
            await context.request.get('/api/admin/posts/' + id)
        ).json()
        expect(stored.draft.title).toBe(changed)
        expect(
            (
                await db.query(
                    'SELECT count(*)::int total FROM posts WHERE id=$1',
                    [id],
                )
            ).rows[0].total,
        ).toBe(1)
    } finally {
        if (id) await db.query('DELETE FROM posts WHERE id=$1', [id])
    }
})
