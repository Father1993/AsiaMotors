import { randomUUID } from 'node:crypto'
import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('catalog list filters, pagination, delete confirmation and responsive layouts', async ({
    page,
    context,
}) => {
    await login(context)
    const marker = 'List ' + randomUUID().slice(0, 8)
    const created: string[] = []
    const headers = { Origin: 'http://127.0.0.1:3110' }
    try {
        for (let i = 0; i < 26; i++) {
            const id = randomUUID()
            const response = await context.request.post('/api/cars', {
                headers,
                data: { id, status: 'draft', brand: marker, model: 'Camry ' + i },
            })
            expect(response.status()).toBe(201)
            created.push(id)
        }
        await page.goto('/admin')
        await page.getByLabel('Марка или модель').fill(marker + ' Camry')
        await page.getByLabel('Публикация', { exact: true }).selectOption('draft')
        await page.getByRole('button', { name: 'Найти', exact: true }).click()
        await expect(page).toHaveURL(/status=draft/)
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('26')
        await expect(page.getByRole('link', { name: 'Далее →' })).toBeVisible()
        await page.getByRole('link', { name: 'Далее →' }).click()
        await expect(page).toHaveURL(/page=2/)
        await expect(page.getByText('Страница 2 из 2')).toBeVisible()
        await expect(page.getByRole('link', { name: 'Редактировать', exact: false }).first()).toHaveAttribute(
            'href',
            /returnTo=.*page%3D2/,
        )
        await page
            .getByRole('button', { name: /^Удалить List/ })
            .first()
            .click()
        const dialog = page.getByRole('dialog')
        await expect(dialog).toContainText(marker)
        await dialog.getByRole('button', { name: 'Отмена' }).click()
        await expect(dialog).not.toBeVisible()
        await page
            .getByRole('button', { name: /^Удалить List/ })
            .first()
            .click()
        await dialog.getByRole('button', { name: 'Удалить автомобиль', exact: true }).click()
        await expect(page).not.toHaveURL(/page=2/)
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('25')
        for (const width of [390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
                true,
            )
            await expect(
                page.getByRole('link', { name: 'Редактировать', exact: false }).first(),
            ).toBeVisible()
            await page.screenshot({ path: `/tmp/asiamotors-list-${width}.png`, fullPage: true })
        }
        await page.getByLabel('Марка или модель').fill(marker + ' missing')
        await page.getByRole('button', { name: 'Найти', exact: true }).click()
        await expect(page.getByRole('heading', { name: 'Автомобили не найдены' })).toBeVisible()
        await page.goBack()
        await expect(page.getByLabel('Марка или модель')).toHaveValue(marker + ' Camry')
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('25')
    } finally {
        for (const id of created) {
            const response = await context.request.get('/api/cars/' + id)
            if (response.ok()) {
                const row = await response.json()
                await context.request.delete('/api/cars/' + id, { headers, data: { version: row.version } })
            }
        }
    }
})

test('list load failures can be retried and expired sessions show sign-in', async ({ page, context }) => {
    await login(context)
    await page.route('**/api/cars', (route) =>
        route.fulfill({ status: 503, json: { error: 'Каталог временно недоступен' } }),
    )
    await page.goto('/admin')
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Каталог временно недоступен')
    await page.unroute('**/api/cars')
    await page.getByRole('button', { name: 'Повторить загрузку' }).click()
    await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Список автомобилей' })).toHaveAttribute(
        'aria-busy',
        'false',
    )
    await page.route('**/api/cars?*', (route) =>
        route.fulfill({ status: 401, json: { error: 'Требуется вход администратора' } }),
    )
    await page.getByLabel('Марка или модель').fill('session-test')
    await page.getByRole('button', { name: 'Найти', exact: true }).click()
    await expect(page.getByRole('link', { name: 'Войти снова' })).toBeVisible()
})
