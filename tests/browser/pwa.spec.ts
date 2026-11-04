import { test, expect } from '@playwright/test'
import { login } from './helpers'

test('PWA manifests identify separate customer and manager apps, with valid icon dimensions', async ({
    request,
}) => {
    const customer = await (await request.get('/manifest.webmanifest')).json()
    const manager = await (await request.get('/pwa/manager.webmanifest')).json()
    expect(customer.id).not.toBe(manager.id)
    expect(customer.start_url).toBe('/')
    expect(manager.start_url).toBe('/admin/dashboard')
    expect(manager.scope).toBe('/') // Sign-in at /auth/signin must stay in the app.
    for (const manifest of [customer, manager])
        for (const icon of manifest.icons) {
            const response = await request.get(icon.src)
            expect(response.ok()).toBeTruthy()
            const png = await response.body()
            const size = Number(icon.sizes.split('x')[0])
            expect(png.readUInt32BE(16)).toBe(size)
            expect(png.readUInt32BE(20)).toBe(size)
        }
    const worker = await request.get('/sw.js')
    expect(worker.headers()['cache-control']).toBe('no-store')
    const workerSource = await worker.text()
    expect(workerSource).not.toContain('__BUILD_ID__')
    expect(workerSource).not.toContain('asiamotors-pwa-development')
})

test('install button appears only after browser event and hides after accepted install', async ({
    page,
}) => {
    await page.goto('/auth/signin')
    await expect(
        page.getByRole('button', {
            name: 'Установить приложение',
            exact: true,
        }),
    ).toHaveCount(0)
    await page.evaluate(() => {
        const event = new Event('beforeinstallprompt', { cancelable: true })
        Object.assign(event, {
            prompt: async () => {},
            userChoice: Promise.resolve({ outcome: 'accepted' }),
        })
        window.dispatchEvent(event)
    })
    await expect(
        page.getByRole('button', {
            name: 'Установить приложение',
            exact: true,
        }),
    ).toBeVisible()
    await page
        .getByRole('button', { name: 'Установить приложение', exact: true })
        .click()
    await expect(
        page.getByRole('button', {
            name: 'Установить приложение',
            exact: true,
        }),
    ).toHaveCount(0)
})

test('iPad desktop user agent gets manual instructions, standalone mode hides installation', async ({
    page,
}) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' })
        Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 })
    })
    await page.goto('/auth/signin')
    await expect(page.getByText(/Нажмите «Поделиться»/)).toBeVisible()
    await expect(
        page.getByRole('button', {
            name: 'Установить приложение',
            exact: true,
        }),
    ).toHaveCount(0)
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'standalone', { get: () => true })
    })
    await page.reload()
    await expect(page.getByText(/Нажмите «Поделиться»/)).toHaveCount(0)
})

test('explicit update protects filled login form and sends activation only after clearing', async ({
    page,
}) => {
    await page.addInitScript(() => {
        const worker = {
            postMessage: () => {
                document.documentElement.dataset.pwaActivated = 'yes'
            },
        }
        const registration = Object.assign(new EventTarget(), {
            waiting: worker,
            update: async () => {},
        })
        navigator.serviceWorker.register = async () =>
            registration as unknown as ServiceWorkerRegistration
    })
    await page.goto('/auth/signin')
    const update = page.getByRole('button', {
        name: 'Обновить приложение',
        exact: true,
    })
    await expect(update).toBeVisible()
    await page.locator('input[type=email]').fill('unsaved@example.test')
    await update.click()
    await expect(
        page.getByText(
            'Перед обновлением завершите или очистите заполненную форму.',
        ),
    ).toBeVisible()
    await expect(page.locator('html')).not.toHaveAttribute(
        'data-pwa-activated',
        'yes',
    )
    await page.locator('input[type=email]').fill('')
    await update.click()
    await expect(page.locator('html')).toHaveAttribute(
        'data-pwa-activated',
        'yes',
    )
})

test('service worker stores only neutral offline pages, never admin, API or HTML from network', async ({
    page,
    context,
}) => {
    await page.goto('/auth/signin')
    await page.evaluate(async () => {
        await navigator.serviceWorker.ready
        await fetch('/api/auth/session')
        await fetch('/admin?_rsc=pwa-test', {
            headers: { RSC: '1', 'Next-Router-Prefetch': '1' },
        })
    })
    await expect
        .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
        .toBe(true)
    const urls = await page.evaluate(async () => {
        const result: string[] = []
        for (const name of await caches.keys()) {
            if (!name.startsWith('asiamotors-pwa-')) continue
            const cache = await caches.open(name)
            result.push(
                ...(await cache.keys()).map((r) => new URL(r.url).pathname),
            )
        }
        return result.sort()
    })
    expect(urls).toEqual(['/pwa/manager-offline.html', '/pwa/offline.html'])
    await context.setOffline(true)
    await page.goto('/admin')
    await expect(
        page.getByRole('heading', { name: 'Нет подключения к интернету' }),
    ).toBeVisible()
    await expect(
        page.getByText(/Данные клиентов и страницы админки не сохраняются/),
    ).toBeVisible()
    await context.setOffline(false)
})

test('each layout emits exactly one matching manifest link', async ({
    page,
    context,
}) => {
    await page.goto('/catalog')
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
        'href',
        '/manifest.webmanifest',
    )
    await page.goto('/auth/signin')
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
        'href',
        '/pwa/manager.webmanifest',
    )
    await login(context)
    await page.goto('/admin')
    await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
        'href',
        '/pwa/manager.webmanifest',
    )
})

test('Android without native prompt offers honest browser menu instructions and upgrades to native prompt', async ({
    page,
}) => {
    await page.addInitScript(() =>
        Object.defineProperty(navigator, 'userAgent', {
            get: () =>
                'Mozilla/5.0 (Android 14; Mobile; rv:130.0) Gecko/130.0 Firefox/130.0',
        }),
    )
    await page.goto('/auth/signin')
    await expect(
        page.getByText(/иногда доступен только ярлык сайта/),
    ).toBeVisible()
    for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        expect(
            await page
                .locator('html')
                .evaluate((el) => el.scrollWidth <= window.innerWidth),
        ).toBe(true)
        await page.screenshot({
            path: '/tmp/asiamotors-pwa-' + width + '.png',
            fullPage: true,
        })
    }
    await expect(
        page.getByRole('button', {
            name: 'Установить приложение',
            exact: true,
        }),
    ).toHaveCount(0)
    await page.evaluate(() => {
        const event = new Event('beforeinstallprompt', { cancelable: true })
        Object.assign(event, {
            prompt: async () => {},
            userChoice: Promise.resolve({ outcome: 'dismissed' }),
        })
        window.dispatchEvent(event)
    })
    await expect(
        page.getByRole('button', {
            name: 'Установить приложение',
            exact: true,
        }),
    ).toBeVisible()
    await expect(
        page.getByText(/иногда доступен только ярлык сайта/),
    ).toHaveCount(0)
})

test('manager update is disabled while a catalog editor has unsaved changes', async ({
    page,
    context,
}) => {
    await login(context)
    await page.addInitScript(() => {
        const registration = Object.assign(new EventTarget(), {
            waiting: {
                postMessage: () => {
                    document.documentElement.dataset.pwaActivated = 'yes'
                },
            },
            update: async () => {},
        })
        navigator.serviceWorker.register = async () =>
            registration as unknown as ServiceWorkerRegistration
    })
    await page.goto('/admin/cars/new')
    const update = page.getByRole('button', {
        name: 'Обновить приложение',
        exact: true,
    })
    await expect(update).toBeEnabled()
    await page
        .getByLabel('Марка *', { exact: true })
        .fill('Несохранённый автомобиль')
    await expect(update).toBeDisabled()
    await expect(
        page.getByText(
            'Сначала сохраните изменения. Обновление перезагрузит страницу.',
        ),
    ).toBeVisible()
    await expect(page.locator('html')).not.toHaveAttribute(
        'data-pwa-activated',
        'yes',
    )
})

test('first controller activation stays quiet but later activation from another tab offers reload', async ({
    page,
}) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator.serviceWorker, 'controller', {
            get: () => null,
            configurable: true,
        })
        const registration = Object.assign(new EventTarget(), {
            waiting: null,
            update: async () => {},
        })
        navigator.serviceWorker.register = async () => {
            document.documentElement.dataset.pwaRegistered = 'yes'
            return registration as unknown as ServiceWorkerRegistration
        }
    })
    await page.goto('/auth/signin')
    await expect(page.locator('html')).toHaveAttribute(
        'data-pwa-registered',
        'yes',
    )
    await page.evaluate(() =>
        navigator.serviceWorker.dispatchEvent(new Event('controllerchange')),
    )
    await expect(
        page.getByRole('button', { name: 'Обновить приложение', exact: true }),
    ).toHaveCount(0)
    await page.evaluate(() =>
        navigator.serviceWorker.dispatchEvent(new Event('controllerchange')),
    )
    await expect(
        page.getByRole('button', { name: 'Обновить приложение', exact: true }),
    ).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute(
        'data-pwa-registered',
        'yes',
    )
})


test('authenticated manager returns from sign-in to operational overview', async ({ page, context }) => {
    await login(context)
    await page.goto('/auth/signin')
    await expect(page).toHaveURL(/\/admin\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'Обзор работы', exact: true })).toBeVisible()
})
