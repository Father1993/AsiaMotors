import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('dashboard: own operational metrics, period filters and responsive drill-down', async ({ page, context }) => {
    await login(context)
    await page.goto('/admin/dashboard')
    await expect(page.getByRole('heading', { name: 'Обзор работы', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Обзор', exact: true })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('heading', { name: 'Требуют внимания сейчас' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Заявки за выбранный период' })).toBeVisible()
    for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        expect(await page.locator('html').evaluate(el => el.scrollWidth <= window.innerWidth)).toBe(true)
        await page.screenshot({ path: `/tmp/asiamotors-dashboard-${width}.png` })
    }
    await page.locator('#dashboard-period').selectOption('7')
    await page.getByRole('button', { name: 'Показать', exact: true }).click()
    await expect(page).toHaveURL(/period=7/)
    await expect(page.getByText('Владивосток (UTC+10)', { exact: false })).toBeVisible()
    const response = await context.request.get('/api/admin/dashboard?period=7')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.requests.total).toBe(data.requests.new + data.requests.processing + data.requests.closed)
    await page.getByRole('link', { name: /^Ошибки почты/ }).click()
    await expect(page).toHaveURL(/mail=failed/)
    await expect(page.getByRole('heading', { name: 'Заявки с сайта', exact: true })).toBeVisible()
})
