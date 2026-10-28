import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { test, expect, type BrowserContext } from '@playwright/test'
import { login } from './helpers'
const origin = 'http://127.0.0.1:3110'
const headers = { Origin: origin }
async function remove(context: BrowserContext, ids: string[]) {
    for (const id of ids) {
        const response = await context.request.get('/api/cars/' + id)
        if (response.ok())
            await context.request.delete('/api/cars/' + id, {
                headers,
                data: { version: (await response.json()).version },
            })
    }
}
async function fixture(context: BrowserContext, brand: string) {
    const id = randomUUID()
    const response = await context.request.post('/api/cars', {
        headers,
        data: { id, brand, model: 'Camry', status: 'draft' },
    })
    expect(response.status()).toBe(201)
    return id
}

test('editor: draft, validation, partial upload retry, cover, publication and cancel', async ({
    page,
    context,
}) => {
    await login(context)
    const marker = 'Editor ' + randomUUID().slice(0, 8)
    const ids: string[] = []
    const returnTo = '/admin?q=' + encodeURIComponent(marker) + '&status=published'
    try {
        await page.goto('/admin/cars/new?returnTo=' + encodeURIComponent(returnTo))
        await page.getByLabel('Марка *', { exact: true }).fill(marker)
        await page.getByLabel('Модель *', { exact: true }).fill('Camry')
        const created = page.waitForResponse(
            (response) => response.url().endsWith('/api/cars') && response.request().method() === 'POST',
        )
        await page.getByRole('button', { name: 'Сохранить черновик', exact: true }).click()
        const record = await (await created).json()
        ids.push(record.id)
        expect(record.status).toBe('draft')
        expect(record.price).toBe(null)
        await expect(page).toHaveURL(new RegExp('/admin/cars/' + record.id))
        await expect(page.locator('.admin-editor-feedback')).toContainText('Изменения сохранены')
        await page.reload()
        await expect(page.getByRole('heading', { name: 'Есть несохранённые данные' })).toHaveCount(0)
        await page.getByRole('button', { name: 'Опубликовать', exact: true }).click()
        await expect(page.getByLabel('Страна каталога', { exact: true })).toHaveAttribute(
            'aria-invalid',
            'true',
        )
        await expect(page.getByLabel('Страна каталога', { exact: true })).toBeFocused()
        await page.getByLabel('Страна каталога', { exact: true }).selectOption('japan')
        await page.getByLabel('Год выпуска', { exact: true }).fill('2026')
        await page.getByLabel('Категория', { exact: true }).selectOption('Седаны')
        await page.getByLabel('Цена, ₽', { exact: true }).fill('2 500 000')
        await page.getByLabel('Пробег, км', { exact: true }).fill('0')
        await page.getByLabel('Объём двигателя, л', { exact: true }).fill('2')
        await page.getByLabel('Мощность, л.с.', { exact: true }).fill('150')
        await page.getByLabel('Тип топлива', { exact: true }).selectOption('Бензин')
        await page.getByLabel('Коробка передач', { exact: true }).selectOption('Автомат')
        await page.getByLabel('Привод', { exact: true }).selectOption('Передний')
        await page.getByLabel('Особенности', { exact: true }).fill('Камера заднего вида\nПодогрев сидений')
        const png = await sharp({ create: { width: 40, height: 30, channels: 3, background: '#7e929f' } })
            .png()
            .toBuffer()
        let count = 0
        let release!: () => void
        const gate = new Promise<void>((resolve) => {
            release = resolve
        })
        await page.route('**/api/uploads', async (route) => {
            count++
            if (count === 1) {
                await gate
                await route.continue()
            } else await route.fulfill({ status: 503, json: { error: 'Тест: загрузка временно недоступна' } })
        })
        await page.getByLabel('Добавить фотографии', { exact: true }).setInputFiles([
            { name: 'front.png', mimeType: 'image/png', buffer: png },
            { name: 'side.png', mimeType: 'image/png', buffer: png },
        ])
        await expect(page.getByRole('button', { name: 'Опубликовать', exact: true })).toBeDisabled()
        release()
        await expect(page.locator('.admin-photo')).toHaveCount(1)
        await expect(page.getByRole('button', { name: 'Повторить', exact: true })).toBeVisible()
        await page.unroute('**/api/uploads')
        await page.getByRole('button', { name: 'Повторить', exact: true }).click()
        await expect(page.locator('.admin-photo')).toHaveCount(2)
        await expect(page.getByRole('button', { name: 'Опубликовать', exact: true })).toBeEnabled()
        const secondImage = await page.locator('.admin-photo img').nth(1).getAttribute('src')
        await page.getByRole('button', { name: 'Сделать главным', exact: true }).click()
        await expect(page.locator('.admin-photo img').first()).toHaveAttribute('src', secondImage!)
        await page.getByRole('button', { name: 'Опубликовать', exact: true }).click()
        await expect(page.locator('.admin-editor-feedback')).toContainText('сохранены и опубликованы')
        let stored = await (await context.request.get('/api/cars/' + record.id)).json()
        expect(stored.status).toBe('published')
        expect(stored.specs.features).toEqual(['Камера заднего вида', 'Подогрев сидений'])
        const savedImages = stored.images
        const publicCars = (await (await context.request.get('/api/catalog')).json()).cars
        expect(publicCars.some((car: { id: string }) => car.id === record.id)).toBe(true)
        for (const width of [390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
                true,
            )
            await page.getByLabel('Цена, ₽', { exact: true }).blur()
            await page.getByLabel('Цена, ₽', { exact: true }).focus()
            expect(
                await page
                    .getByLabel('Цена, ₽', { exact: true })
                    .evaluate(
                        (input) =>
                            input.getBoundingClientRect().bottom <
                            document.querySelector('.admin-editor-footer')!.getBoundingClientRect().top,
                    ),
            ).toBe(true)
            await page.evaluate(() => window.scrollTo(0, 0))
            await page.screenshot({ path: `/tmp/asiamotors-editor-${width}.png`, fullPage: true })
        }
        await page.getByRole('button', { name: 'Скрыть с сайта', exact: true }).click()
        await expect(page.getByRole('button', { name: 'Вернуть на сайт', exact: true })).toBeVisible()
        expect(
            (await (await context.request.get('/api/catalog')).json()).cars.some(
                (car: { id: string }) => car.id === record.id,
            ),
        ).toBe(false)
        await page.getByRole('button', { name: 'Вернуть на сайт', exact: true }).click()
        await expect(page.getByRole('button', { name: 'Скрыть с сайта', exact: true })).toBeVisible()
        await page.getByRole('button', { name: 'Удалить фото 1', exact: true }).click()
        page.once('dialog', (dialog) => dialog.accept())
        await page.getByRole('link', { name: 'Отмена', exact: true }).click()
        await expect(page).toHaveURL(origin + returnTo)
        await page.goto('/admin/cars/' + record.id)
        await expect(page.locator('.admin-photo')).toHaveCount(2)
        stored = await (await context.request.get('/api/cars/' + record.id)).json()
        expect(stored.images).toEqual(savedImages)
    } finally {
        await remove(context, ids)
    }
})

test('editor: recovery, two-tab conflict and expired session preserve input', async ({ page, context }) => {
    await login(context)
    const id = await fixture(context, 'Recovery ' + randomUUID().slice(0, 8))
    try {
        await page.goto('/admin/cars/' + id)
        await page.getByLabel('Модель *', { exact: true }).fill('Несохранённая модель')
        page.once('dialog', (dialog) => dialog.accept())
        await page.reload()
        await expect(page.getByRole('heading', { name: 'Есть несохранённые данные' })).toBeVisible()
        await page.getByRole('button', { name: 'Восстановить', exact: true }).click()
        await expect(page.getByLabel('Модель *', { exact: true })).toHaveValue('Несохранённая модель')
        const other = await context.newPage()
        await other.goto('/admin/cars/' + id)
        await other.getByLabel('Модель *', { exact: true }).fill('Сохранено другой вкладкой')
        await other.getByRole('button', { name: 'Сохранить черновик', exact: true }).click()
        await expect(other.locator('.admin-editor-feedback')).toContainText('Изменения сохранены')
        await page.getByRole('button', { name: 'Сохранить черновик', exact: true }).click()
        await expect(
            page.getByRole('link', { name: 'Открыть актуальную запись для сравнения ↗' }),
        ).toBeVisible()
        await expect(page.getByLabel('Модель *', { exact: true })).toHaveValue('Несохранённая модель')
        expect((await (await context.request.get('/api/cars/' + id)).json()).model).toBe(
            'Сохранено другой вкладкой',
        )
        await page.route('**/api/cars/' + id, (route) =>
            route.request().method() === 'PUT'
                ? route.fulfill({ status: 401, json: { error: 'Требуется вход администратора' } })
                : route.continue(),
        )
        await page.getByRole('button', { name: 'Сохранить черновик', exact: true }).click()
        await expect(page.getByRole('link', { name: 'Войти в отдельной вкладке ↗' })).toBeVisible()
        await expect(page.getByLabel('Модель *', { exact: true })).toHaveValue('Несохранённая модель')
    } finally {
        await remove(context, [id])
    }
})

test('editor: lost POST response is reconciled without duplicate and later edits recover', async ({
    page,
    context,
}) => {
    await login(context)
    const brand = 'LostResponse ' + randomUUID().slice(0, 8)
    const ids: string[] = []
    try {
        await page.goto('/admin/cars/new')
        await page.getByLabel('Марка *', { exact: true }).fill(brand)
        await page.getByLabel('Модель *', { exact: true }).fill('Camry')
        await page.route('**/api/cars', async (route) => {
            if (route.request().method() !== 'POST') return route.continue()
            const response = await route.fetch()
            ids.push((await response.json()).id)
            await route.abort('failed')
        })
        await page.getByRole('button', { name: 'Сохранить черновик', exact: true }).click()
        await expect(page.locator('.admin-editor-feedback')).toContainText('Изменения сохранены')
        expect(ids).toHaveLength(1)
        await expect(page).toHaveURL(new RegExp('/admin/cars/' + ids[0]))
        const listed = await (await context.request.get('/api/cars?q=' + encodeURIComponent(brand))).json()
        expect(listed.total).toBe(1)
        await page.getByLabel('Модель *', { exact: true }).fill('После первого сохранения')
        page.once('dialog', (dialog) => dialog.accept())
        await page.reload()
        await expect(page.getByRole('heading', { name: 'Есть несохранённые данные' })).toBeVisible()
        await page.getByRole('button', { name: 'Восстановить', exact: true }).click()
        await expect(page.getByLabel('Модель *', { exact: true })).toHaveValue('После первого сохранения')
    } finally {
        await remove(context, ids)
    }
})

test('editor: finishing a save after leaving does not rewrite the list URL', async ({ page, context }) => {
    await login(context)
    const ids: string[] = []
    let release!: () => void
    let stored!: () => void
    let delivered!: () => void
    const gate = new Promise<void>((resolve) => {
        release = resolve
    })
    const committed = new Promise<void>((resolve) => {
        stored = resolve
    })
    const completed = new Promise<void>((resolve) => {
        delivered = resolve
    })
    try {
        await page.goto('/admin/cars/new')
        await page.getByLabel('Марка *', { exact: true }).fill('Late response ' + randomUUID().slice(0, 8))
        await page.getByLabel('Модель *', { exact: true }).fill('Camry')
        await page.route('**/api/cars', async (route) => {
            if (route.request().method() !== 'POST') return route.continue()
            const response = await route.fetch()
            ids.push((await response.json()).id)
            stored()
            await gate
            try {
                await route.fulfill({ response })
            } finally {
                delivered()
            }
        })
        await page.getByRole('button', { name: 'Сохранить черновик', exact: true }).click()
        await committed
        page.once('dialog', (dialog) => dialog.accept())
        await page.getByRole('link', { name: 'Отмена', exact: true }).click()
        await expect(page).toHaveURL(origin + '/admin')
        const response = page.waitForResponse(
            (item) => item.request().method() === 'POST' && item.url().endsWith('/api/cars'),
        )
        release()
        await completed
        await response
        // Let the abandoned fetch continuation run before observing global history.
        await page.evaluate(
            () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        )
        await expect(page).toHaveURL(origin + '/admin')
        await expect(page.getByRole('heading', { name: 'Автомобили', exact: true })).toBeVisible()
    } finally {
        release()
        await remove(context, ids)
    }
})
