import { test, expect } from '@playwright/test'
import { login } from './helpers'
for (const width of [390, 768, 1440]) {
    test(`admin shell and public routes at ${width}px`, async ({ page, context }) => {
        await page.setViewportSize({ width, height: 900 })
        await login(context)
        await page.goto('/admin')
        await expect(page.getByRole('navigation', { name: 'Администрирование' })).toBeVisible()
        await expect(page.getByRole('link', { name: 'Автомобили', exact: true })).toHaveAttribute(
            'aria-current',
            'page',
        )
        expect(await page.locator('footer').count()).toBe(0)
        expect(await page.locator('.cookie-popup').count()).toBe(0)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
            true,
        )
        await page.screenshot({ path: `/tmp/asiamotors-shell-${width}.png`, fullPage: true })
        await page.getByRole('link', { name: 'Заявки', exact: true }).click()
        await expect(page).toHaveURL(/\/admin\/requests$/)
        await expect(page.getByRole('heading', { name: 'Заявки с сайта' })).toBeVisible()
        for (const path of ['/', '/catalog', '/contacts']) {
            const response = await page.goto(path)
            expect(response?.status()).toBe(200)
            await expect(page.locator('footer')).toBeVisible()
        }
    })
}
