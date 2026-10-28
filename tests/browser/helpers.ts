import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { expect, type BrowserContext } from '@playwright/test'

export async function login(context: BrowserContext) {
    const values = Object.fromEntries(
        readFileSync('.env', 'utf8')
            .split('\n')
            .filter((line) => line && !line.startsWith('#'))
            .map((line) => {
                const index = line.indexOf('=')
                const value = line.slice(index + 1)
                try {
                    return [line.slice(0, index), JSON.parse(value)]
                } catch {
                    return [line.slice(0, index), value]
                }
            }),
    )
    const csrf = await context.request.get('/api/auth/csrf')
    const { csrfToken } = await csrf.json()
    const response = await context.request.post('/api/auth/callback/credentials', {
        headers: { 'X-Real-IP': 'browser-test-' + randomUUID() },
        form: {
            csrfToken,
            email: values.ADMIN_EMAIL,
            password: values.ADMIN_PASSWORD,
            json: 'true',
            callbackUrl: 'http://127.0.0.1:3110/admin',
        },
    })
    expect(response.ok()).toBeTruthy()
    const session = await context.request.get('/api/auth/session')
    expect((await session.json()).user?.isAdmin).toBe(true)
}
