import { defineConfig } from '@playwright/test'
export default defineConfig({
    testDir: './tests/browser',
    workers: 1,
    timeout: 60000,
    expect: { timeout: 15000 },
    use: { baseURL: 'http://127.0.0.1:3110', headless: true, trace: 'off' },
    reporter: 'list',
})
