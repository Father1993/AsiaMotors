import 'server-only'
import { Pool } from 'pg'
import { readFileSync } from 'node:fs'

const globalDb = globalThis as typeof globalThis & { appPool?: Pool }
export function database() {
    if (!globalDb.appPool) {
        const password = process.env.POSTGRES_PASSWORD_FILE
            ? readFileSync(process.env.POSTGRES_PASSWORD_FILE, 'utf8').trim()
            : process.env.POSTGRES_PASSWORD
        globalDb.appPool = new Pool(
            process.env.DATABASE_URL
                ? {
                      connectionString: process.env.DATABASE_URL,
                      max: 5,
                      connectionTimeoutMillis: 5000,
                      idleTimeoutMillis: 30000,
                  }
                : {
                      host: process.env.PGHOST || 'db',
                      port: Number(process.env.PGPORT || 5432),
                      database: process.env.POSTGRES_DB || 'asiamotors',
                      user: process.env.POSTGRES_USER || 'asiamotors',
                      password,
                      max: 5,
                      connectionTimeoutMillis: 5000,
                      idleTimeoutMillis: 30000,
                  }
        )
        globalDb.appPool.on('error', () =>
            console.error('Database connection error')
        )
    }
    return globalDb.appPool
}
