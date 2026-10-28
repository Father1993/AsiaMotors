import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { test, expect } from '@playwright/test'
import { login } from './helpers'
const db = new pg.Pool({
    host: '127.0.0.1',
    port: 35432,
    database: 'asiamotors',
    user: 'asiamotors',
    password: readFileSync('.secrets/db_app_password', 'utf8').trim(),
    max: 2,
})
const origin = 'http://127.0.0.1:3110'
const headers = { Origin: origin }
async function fixture(marker: string, state: 'pending' | 'sent' | 'failed' = 'pending') {
    const id = randomUUID()
    const payload = {
        form_name: 'Форма заказа автомобиля',
        user_name: marker,
        user_phone: '8 (999) 000-22-33',
        user_city: 'Владивосток',
        car_model: 'Toyota Camry',
        message: 'Нужна машина в хорошей комплектации.\nПозвоните после обеда.',
    }
    await db.query(
        `INSERT INTO leads(id,request_key,payload,consent_version,status) VALUES($1,$2,$3,'2026-10-27','new')`,
        [id, randomUUID(), payload],
    )
    await db.query(
        `INSERT INTO mail_outbox(lead_id,status,attempts,last_error,sent_at,next_attempt_at) VALUES($1,$2,$3,$4,CASE WHEN $2='sent' THEN now() ELSE NULL END,now()+interval '1 day')`,
        [id, state, state === 'failed' ? 12 : 0, state === 'failed' ? 'EAUTH' : null],
    )
    return id
}
test.afterAll(async () => db.end())

test('requests: filters, phone search, pagination, detail, statuses, deletion and responsive views', async ({
    page,
    context,
}) => {
    await login(context)
    const marker = 'Request ' + randomUUID().slice(0, 8)
    const ids: string[] = []
    try {
        for (let i = 0; i < 26; i++)
            ids.push(await fixture(marker + ' ' + i, i === 0 ? 'failed' : i === 1 ? 'sent' : 'pending'))
        await page.goto('/admin/requests?q=' + encodeURIComponent(marker))
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('26')
        await expect(page.getByRole('region', { name: 'Режим отправки почты' })).toContainText(
            'Отправка почты выключена',
        )
        await expect(page.getByText('Ожидает включения почты').first()).toBeVisible()
        await page.getByRole('link', { name: 'Далее →' }).click()
        await expect(page.getByText('Страница 2 из 2')).toBeVisible()
        await page.getByRole('link', { name: /Открыть заявку/ }).click()
        await expect(page.getByRole('link', { name: '8 (999) 000-22-33', exact: true })).toHaveAttribute(
            'href',
            'tel:+79990002233',
        )
        await page.getByLabel('Статус заявки', { exact: true }).selectOption('processing')
        await expect(page.getByRole('status')).toContainText('Статус заявки сохранён')
        await page.getByRole('link', { name: '← К заявкам' }).click()
        await expect(page).toHaveURL(/page=2/)
        await page.goto(
            '/admin/requests/' +
                ids[0] +
                '?returnTo=' +
                encodeURIComponent('/admin/requests?q=' + marker + '&page=2'),
        )
        await expect(page.getByText('Ошибка отправки', { exact: true })).toBeVisible()
        await expect(page.getByText('Почтовый сервер отклонил вход.', { exact: false })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Повторить отправку', exact: true })).toBeDisabled()
        for (const width of [390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            expect(await page.locator('html').evaluate((el) => el.scrollWidth <= window.innerWidth)).toBe(
                true,
            )
            await page.screenshot({ path: `/tmp/asiamotors-request-detail-${width}.png`, fullPage: true })
        }
        await page.getByText('Служебные данные и согласие', { exact: true }).click()
        await page.getByRole('button', { name: 'Удалить заявку', exact: true }).click()
        await expect(page.getByRole('dialog')).toContainText(marker + ' 0')
        await page.getByRole('dialog').getByRole('button', { name: 'Отмена', exact: true }).click()
        await expect(page.getByRole('button', { name: 'Удалить заявку', exact: true })).toBeFocused()
        expect((await context.request.get('/api/admin/leads/' + ids[0])).status()).toBe(200)
        await page.getByRole('button', { name: 'Удалить заявку', exact: true }).click()
        await page.getByRole('dialog').getByRole('button', { name: 'Удалить заявку', exact: true }).click()
        await expect(page).toHaveURL(
            (url) => url.pathname === '/admin/requests' && url.searchParams.get('q') === marker,
        )
        await expect(page).not.toHaveURL(/page=2/)
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('25')
        expect((await context.request.get('/api/admin/leads/' + ids[0])).status()).toBe(404)
        await page.getByLabel('Имя, телефон или автомобиль').fill('89990002233')
        await page.getByRole('button', { name: 'Найти', exact: true }).click()
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('25')
        await page.getByLabel('Отправка письма').selectOption('sent')
        await page.getByRole('button', { name: 'Найти', exact: true }).click()
        await expect(page.getByText('Найдено:', { exact: false })).toContainText('1')
        await expect(page.getByText('Принято почтовым сервером', { exact: true })).toBeVisible()
        await page.getByLabel('Отправка письма').selectOption('pending')
        await page.getByRole('button', { name: 'Найти', exact: true }).click()
        for (const width of [390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            await expect(page.locator('.request-row').first()).toBeVisible()
            expect(await page.locator('html').evaluate((el) => el.scrollWidth <= window.innerWidth)).toBe(
                true,
            )
            await page.screenshot({ path: `/tmp/asiamotors-requests-${width}.png`, fullPage: true })
        }
        await page.getByRole('link', { name: 'Новая', exact: false }).first().click()
        await expect(page).toHaveURL(/status=new/)
        await page.getByLabel('Имя, телефон или автомобиль').fill(marker + ' missing')
        await page.getByRole('button', { name: 'Найти', exact: true }).click()
        await expect(page.getByRole('heading', { name: 'Заявки не найдены' })).toBeVisible()
    } finally {
        await db.query('DELETE FROM leads WHERE id=ANY($1::uuid[])', [ids])
    }
})

test('requests API guards status conflicts, missing rows, disabled retries and authentication', async ({
    context,
    playwright,
}) => {
    await login(context)
    const id = await fixture('API ' + randomUUID().slice(0, 8), 'failed')
    const anon = await playwright.request.newContext({ baseURL: origin })
    try {
        expect((await anon.get('/api/admin/leads')).status()).toBe(401)
        expect((await anon.get('/api/admin/leads/' + id)).status()).toBe(401)
        expect(
            (
                await context.request.patch('/api/admin/leads/' + id, {
                    headers: { Origin: 'https://invalid.test' },
                    data: { status: 'processing' },
                })
            ).status(),
        ).toBe(403)
        expect(
            (
                await context.request.patch('/api/admin/leads/' + id, {
                    headers,
                    data: { status: 'processing', expectedStatus: 'new' },
                })
            ).status(),
        ).toBe(200)
        expect(
            (
                await context.request.patch('/api/admin/leads/' + id, {
                    headers,
                    data: { status: 'closed', expectedStatus: 'new' },
                })
            ).status(),
        ).toBe(409)
        expect(
            (
                await context.request.patch('/api/admin/leads/' + id, { headers, data: { retry: true } })
            ).status(),
        ).toBe(409)
        const row = (
            await db.query('SELECT status,attempts,last_error FROM mail_outbox WHERE lead_id=$1', [id])
        ).rows[0]
        expect(row).toEqual({ status: 'failed', attempts: 12, last_error: 'EAUTH' })
        expect(
            (
                await context.request.patch('/api/admin/leads/' + randomUUID(), {
                    headers,
                    data: { status: 'closed' },
                })
            ).status(),
        ).toBe(404)
        expect((await context.request.get('/api/admin/leads?page=0')).status()).toBe(400)
        expect((await context.request.patch('/api/admin/leads/' + id, { headers, data: {} })).status()).toBe(
            400,
        )
    } finally {
        await anon.dispose()
        await db.query('DELETE FROM leads WHERE id=$1', [id])
    }
})

test('requests: load failure, retry and expired session preserve a clear interface', async ({
    page,
    context,
}) => {
    await login(context)
    await page.route('**/api/admin/leads', (route) =>
        route.fulfill({ status: 503, json: { error: 'Заявки временно недоступны' } }),
    )
    await page.goto('/admin/requests')
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Заявки временно недоступны')
    await page.unroute('**/api/admin/leads')
    await page.getByRole('button', { name: 'Повторить загрузку' }).click()
    await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Список заявок' })).toHaveAttribute('aria-busy', 'false')
    await page.route('**/api/admin/leads?*', (route) =>
        route.fulfill({ status: 401, json: { error: 'Требуется вход администратора' } }),
    )
    await page.getByLabel('Имя, телефон или автомобиль').fill('session-test')
    await page.getByRole('button', { name: 'Найти', exact: true }).click()
    await expect(page.getByRole('link', { name: 'Войти снова' })).toBeVisible()
    await expect(page.locator('.request-row')).toHaveCount(0)
})

test('future mail mode: failed delivery can be requeued once and sent delivery cannot be resent', async ({
    page,
    context,
}) => {
    test.skip(
        process.env.TEST_MAIL_ENABLED !== 'true',
        'Runs separately with the isolated web configured for enabled mail',
    )
    await login(context)
    const id = await fixture('Future SMTP ' + randomUUID().slice(0, 8), 'failed')
    try {
        await page.goto('/admin/requests/' + id)
        await expect(page.getByRole('region', { name: 'Режим отправки почты' })).toContainText(
            'Отправка почты включена',
        )
        await page.getByRole('button', { name: 'Повторить отправку', exact: true }).click()
        await page.getByRole('dialog').getByRole('button', { name: 'Вернуть в очередь', exact: true }).click()
        await expect(page.getByRole('status')).toContainText('Письмо возвращено в очередь')
        expect(
            (
                await context.request.patch('/api/admin/leads/' + id, { headers, data: { retry: true } })
            ).status(),
        ).toBe(409)
        await db.query(
            "UPDATE mail_outbox SET status='sent',sent_at=now(),last_error=NULL WHERE lead_id=$1",
            [id],
        )
        await page.getByRole('button', { name: 'Обновить', exact: true }).click()
        await expect(page.getByText('Принято почтовым сервером', { exact: true })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Повторить отправку', exact: true })).toHaveCount(0)
        expect(
            (
                await context.request.patch('/api/admin/leads/' + id, { headers, data: { retry: true } })
            ).status(),
        ).toBe(409)
    } finally {
        await db.query('DELETE FROM leads WHERE id=$1', [id])
    }
})
