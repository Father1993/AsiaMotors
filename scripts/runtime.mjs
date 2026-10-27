import pg from 'pg'
import { readFileSync } from 'node:fs'
export function dbConfig() {
    return process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
              host: process.env.PGHOST || 'db',
              port: Number(process.env.PGPORT || 5432),
              database: process.env.POSTGRES_DB || 'asiamotors',
              user: process.env.POSTGRES_USER || 'asiamotors',
              password: process.env.POSTGRES_PASSWORD_FILE
                  ? readFileSync(
                        process.env.POSTGRES_PASSWORD_FILE,
                        'utf8'
                    ).trim()
                  : process.env.POSTGRES_PASSWORD,
          }
}
export function pool() {
    const p = new pg.Pool({
        ...dbConfig(),
        max: 2,
        connectionTimeoutMillis: 5000,
    })
    p.on('error', () => console.error('Database connection error'))
    return p
}
