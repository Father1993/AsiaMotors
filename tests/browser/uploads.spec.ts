import sharp from 'sharp'
import { test, expect } from '@playwright/test'
import { login } from './helpers'

const origin = 'http://127.0.0.1:3110'
test('release upload endpoint accepts JPEG, PNG and WebP and enforces access and size', async ({
    context,
    playwright,
}) => {
    await login(context)
    const anonymous = await playwright.request.newContext({ baseURL: origin })
    try {
        for (const format of ['jpeg', 'png', 'webp'] as const) {
            const buffer = await sharp({
                create: { width: 32, height: 24, channels: 3, background: '#8796a5' },
            })
                .toFormat(format)
                .toBuffer()
            const file = { name: `car.${format}`, mimeType: 'image/' + format, buffer }
            if (format === 'jpeg') {
                expect(
                    (
                        await anonymous.post('/api/uploads', {
                            headers: { Origin: origin },
                            multipart: { file },
                        })
                    ).status(),
                ).toBe(401)
                expect(
                    (
                        await context.request.post('/api/uploads', {
                            headers: { Origin: 'https://invalid.test' },
                            multipart: { file },
                        })
                    ).status(),
                ).toBe(403)
            }
            const response = await context.request.post('/api/uploads', {
                headers: { Origin: origin },
                multipart: { file },
            })
            expect(response.status()).toBe(201)
            expect(response.headers()['content-type']).toContain('application/json')
            const { url } = await response.json()
            expect(url).toMatch(/^\/media\/[0-9a-f-]{36}\.webp$/)
            const image = await anonymous.get(url)
            expect(image.ok()).toBe(true)
            expect((await sharp(await image.body()).metadata()).format).toBe('webp')
        }
        for (const buffer of [Buffer.alloc(0), Buffer.alloc(10 * 1024 * 1024 + 1)]) {
            const response = await context.request.post('/api/uploads', {
                headers: { Origin: origin },
                multipart: { file: { name: 'car.png', mimeType: 'image/png', buffer } },
            })
            expect(response.status()).toBe(400)
            expect((await response.json()).error).toContain('10 МБ')
        }
    } finally {
        await anonymous.dispose()
    }
})
