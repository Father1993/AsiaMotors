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
        await page
            .getByRole('tab', { name: 'Текст статьи', exact: true })
            .click()
        await expect(
            page.getByRole('textbox', { name: 'Текст статьи', exact: true }),
        ).toBeEditable()
        await page.screenshot({
            path: '/tmp/asiamotors-editor-ready.png',
            fullPage: false,
        })
        await page.getByRole('tab', { name: 'Основное', exact: true }).click()
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
        await page.getByRole('tab', { name: 'Анонс', exact: true }).click()
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
            .getByRole('tab', { name: 'Текст статьи', exact: true })
            .click()
        await page
            .getByRole('textbox', { name: 'Текст статьи', exact: true })
            .fill(
                'Первый опубликованный текст. Сравниваем комплектации, привод и стоимость доставки автомобиля из Китая во Владивосток.',
            )
        await page.getByRole('button', { name: 'Таблица', exact: true }).click()
        await page
            .getByRole('menuitem', { name: 'Вставить таблицу 3 × 3' })
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
        await page.getByRole('tab', { name: 'Публикация', exact: true }).click()
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
        await page
            .getByRole('tab', { name: 'Текст статьи', exact: true })
            .click()
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
        await page
            .getByRole('tab', { name: 'Текст статьи', exact: true })
            .click()
        await expect(
            page.getByRole('textbox', { name: 'Текст статьи', exact: true }),
        ).toHaveText(text)
        await page.getByRole('tab', { name: 'Основное', exact: true }).click()
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

test('posts: accessible tabs, Word paste, retained link/image selections and table keyboard actions', async ({
    page,
    context,
}) => {
    await login(context)
    let id = ''
    try {
        await page.goto('/admin/blog/new')
        const firstTab = page.getByRole('tab', {
            name: 'Основное',
            exact: true,
        })
        await firstTab.focus()
        await page.keyboard.press('End')
        await expect(
            page.getByRole('tab', { name: 'Публикация', exact: true }),
        ).toHaveAttribute('aria-selected', 'true')
        await page.keyboard.press('Home')
        await expect(firstTab).toHaveAttribute('aria-selected', 'true')
        await page
            .getByLabel('Заголовок статьи', { exact: true })
            .fill('Интерфейс редактора ' + randomUUID().slice(0, 8))
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByText('Все изменения сохранены', { exact: true }),
        ).toBeVisible()
        id = new URL(page.url()).pathname.split('/').pop()!
        // Publication errors open the announcement tab and put focus on the first invalid field.
        await page.getByRole('tab', { name: 'SEO', exact: true }).click()
        await page
            .getByRole('button', { name: 'Опубликовать', exact: true })
            .click()
        await expect(
            page.getByRole('tab', { name: 'Анонс', exact: true }),
        ).toHaveAttribute('aria-selected', 'true')
        await expect(
            page.getByLabel('Краткое описание', { exact: true }),
        ).toBeFocused()
        await page
            .getByRole('tab', { name: 'Текст статьи', exact: true })
            .click()
        const body = page.getByRole('textbox', {
            name: 'Текст статьи',
            exact: true,
        })
        await body.pressSequentially(
            'Changan UNI-K и Geely Monjaro: сравнение автомобилей для заказа из Китая.',
        )
        await expect(
            page.getByText('Есть несохранённые изменения', { exact: true }),
        ).toBeVisible()
        await body.focus()
        await page.keyboard.press('Control+Home')
        await page.keyboard.down('Shift')
        for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowRight')
        await page.keyboard.up('Shift')
        await expect
            .poll(() => page.evaluate(() => window.getSelection()?.toString()))
            .toBe('Changan')
        await page
            .getByRole('button', { name: 'Полужирный', exact: true })
            .click()
        await expect
            .poll(() => page.evaluate(() => window.getSelection()?.toString()))
            .toBe('Changan')
        await page
            .getByRole('button', { name: 'Вставить ссылку', exact: true })
            .click()
        let dialog = page.getByRole('dialog')
        await expect(
            dialog.getByLabel('Текст ссылки', { exact: true }),
        ).toHaveValue('Changan')
        await dialog
            .getByLabel('Адрес ссылки', { exact: true })
            .fill('/catalog')
        await dialog.getByRole('button', { name: 'Применить ссылку' }).click()
        await expect(body.locator('a')).toHaveText('Changan')
        await expect(body.locator('a')).toHaveAttribute('href', '/catalog')
        await expect(body.locator('strong a, a strong')).toHaveText('Changan')
        await body.focus()
        await page.keyboard.press('Control+End')
        await page.keyboard.press('Enter')
        const tableMenu = page.getByRole('button', {
            name: 'Таблица',
            exact: true,
        })
        await tableMenu.focus()
        await page.keyboard.press('ArrowDown')
        await page.keyboard.press('Enter')
        await expect(body.locator('table tr')).toHaveCount(3)
        await body.locator('td').first().click()
        await tableMenu.click()
        await page
            .getByRole('menuitem', { name: 'Добавить строку ниже' })
            .click()
        await expect(body.locator('table tr')).toHaveCount(4)
        await body.focus()
        await page.keyboard.press('Control+End')
        await page.keyboard.press('ArrowDown')
        await page
            .getByRole('button', { name: 'Вставить фотографию', exact: true })
            .click()
        dialog = page.getByRole('dialog')
        await dialog.getByLabel('Фотография', { exact: true }).setInputFiles({
            name: 'photo.png',
            mimeType: 'image/png',
            buffer: readFileSync('public/img/android-chrome-192x192.png'),
        })
        await expect(dialog.locator('.post-dialog-photo img')).toBeVisible()
        await dialog
            .getByLabel('Что изображено на фотографии (alt)', { exact: true })
            .fill('Проверка автомобиля')
        await dialog
            .getByLabel('Подпись под фотографией', { exact: true })
            .fill('Исходная подпись')
        await dialog
            .getByRole('button', { name: 'Вставить фотографию', exact: true })
            .click()
        await expect(body.locator('img')).toHaveCount(1)
        await body.locator('img').click()
        await page
            .getByRole('button', { name: 'Изменить фотографию', exact: true })
            .click()
        dialog = page.getByRole('dialog')
        await expect(
            dialog.getByLabel('Что изображено на фотографии (alt)', {
                exact: true,
            }),
        ).toHaveValue('Проверка автомобиля')
        await dialog
            .getByLabel('Подпись под фотографией', { exact: true })
            .fill('Обновлённая подпись')
        await dialog
            .getByRole('button', { name: 'Сохранить фотографию' })
            .click()
        await expect(body.locator('img')).toHaveAttribute(
            'data-caption',
            'Обновлённая подпись',
        )
        await page
            .getByRole('button', { name: 'Отменить действие', exact: true })
            .click()
        await expect(body.locator('img')).toHaveAttribute(
            'data-caption',
            'Исходная подпись',
        )
        await page
            .getByRole('button', { name: 'Повторить действие', exact: true })
            .click()
        await expect(body.locator('img')).toHaveAttribute(
            'data-caption',
            'Обновлённая подпись',
        )
        await body.focus()
        await page.keyboard.press('Control+End')
        await page.keyboard.press('ArrowDown')
        const remoteRequests: string[] = []
        page.on('request', (request) => {
            if (request.url().includes('invalid.example'))
                remoteRequests.push(request.url())
        })
        await body.evaluate((element) => {
            const data = new DataTransfer()
            data.setData(
                'text/html',
                '<p class="MsoNormal" style="color:red"><strong>Текст из Word</strong></p><img src="https://invalid.example/remote.png"><script>window.__unsafeRan = true</script>',
            )
            data.setData('text/plain', 'Текст из Word')
            element.dispatchEvent(
                new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: data,
                }),
            )
        })
        await expect(body).toContainText('Текст из Word')
        await expect(body.locator('img')).toHaveCount(1)
        expect(
            await page.evaluate(() => Reflect.has(window, '__unsafeRan')),
        ).toBe(false)
        await page
            .getByRole('button', { name: 'Сохранить черновик', exact: true })
            .click()
        await expect(
            page.getByText('Все изменения сохранены', { exact: true }),
        ).toBeVisible()
        const post = await (
            await context.request.get('/api/admin/posts/' + id)
        ).json()
        const content = JSON.stringify(post.draft.content)
        expect(content).toContain('Текст из Word')
        expect(content).not.toContain('MsoNormal')
        expect(content).not.toContain('invalid.example')
        expect(remoteRequests).toEqual([])
    } finally {
        if (id) await db.query('DELETE FROM posts WHERE id=$1', [id])
    }
})

test.describe('scheduled publication in manager time zone', () => {
    test.use({ timezoneId: 'America/New_York' })
    test('posts: schedules Vladivostok time independently of browser zone and cancels explicitly', async ({
        page,
        context,
    }) => {
        await login(context)
        const id = randomUUID()
        const headers = { Origin: 'http://127.0.0.1:3110' }
        try {
            const image = await context.request.post('/api/uploads', {
                headers,
                multipart: {
                    file: {
                        name: 'cover.png',
                        mimeType: 'image/png',
                        buffer: readFileSync(
                            'public/img/android-chrome-192x192.png',
                        ),
                    },
                },
            })
            expect(image.status()).toBe(201)
            const { url } = await image.json()
            const title = 'Расписание публикации ' + id.slice(0, 8)
            const document = {
                title,
                excerpt:
                    'Сравнение новых автомобилей из Китая и условия заказа с доставкой.',
                author: 'AsiaMotors',
                cover: url,
                coverAlt: 'Автомобиль',
                tags: [],
                seoTitle: '',
                seoDescription: '',
                showCta: true,
                content: {
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: 'Сравниваем новые автомобили из Китая: оснащение, полную стоимость доставки и условия заказа.',
                                },
                            ],
                        },
                    ],
                },
            }
            const created = await context.request.post('/api/admin/posts', {
                headers,
                data: { id, slug: 'scheduled-' + id, document },
            })
            expect(created.status()).toBe(201)
            await page.goto('/admin/blog/edit/' + id)
            await page
                .getByRole('tab', { name: 'Публикация', exact: true })
                .click()
            await page.getByLabel('В указанное время', { exact: true }).check()
            const local = new Date(Date.now() + 86400000 + 10 * 3600000)
                .toISOString()
                .slice(0, 16)
            await page
                .getByLabel('Дата и время (Владивосток, UTC+10)', {
                    exact: true,
                })
                .fill(local)
            await page
                .getByRole('button', {
                    name: 'Запланировать публикацию',
                    exact: true,
                })
                .click()
            await expect(page.getByRole('status')).toHaveText(
                'Публикация запланирована',
            )
            let saved = await (
                await context.request.get('/api/admin/posts/' + id)
            ).json()
            expect(saved.scheduled_at).toBe(
                new Date(local + ':00+10:00').toISOString(),
            )
            expect(saved.scheduled_document.title).toBe(title)
            expect(
                (await context.request.get('/blog/' + saved.slug)).status(),
            ).toBe(404)
            await page
                .getByRole('tab', { name: 'Основное', exact: true })
                .click()
            await expect(
                page.getByLabel('Адрес страницы', { exact: true }),
            ).toHaveAttribute('readonly', '')
            await page
                .getByLabel('Заголовок статьи', { exact: true })
                .fill(title + ' следующие правки')
            await page
                .getByRole('button', {
                    name: 'Сохранить черновик',
                    exact: true,
                })
                .click()
            await expect(
                page.getByText('Все изменения сохранены', { exact: true }),
            ).toBeVisible()
            saved = await (
                await context.request.get('/api/admin/posts/' + id)
            ).json()
            expect(saved.scheduled_document.title).toBe(title)
            await page
                .getByRole('tab', { name: 'Публикация', exact: true })
                .click()
            await page
                .getByRole('button', {
                    name: 'Отменить расписание',
                    exact: true,
                })
                .click()
            await page
                .getByRole('dialog')
                .getByRole('button', {
                    name: 'Отменить расписание',
                    exact: true,
                })
                .click()
            await expect(page.getByRole('status')).toHaveText(
                'Публикация по расписанию отменена',
            )
            saved = await (
                await context.request.get('/api/admin/posts/' + id)
            ).json()
            expect(saved.scheduled_at).toBeNull()
            expect(saved.scheduled_document).toBeNull()
        } finally {
            await db.query('DELETE FROM posts WHERE id=$1', [id])
        }
    })
})
