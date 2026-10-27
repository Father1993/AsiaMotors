import { pool } from './runtime.mjs'
import { readdir, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const db = pool()
const c = await db.connect()
try {
    await c.query('SELECT pg_advisory_lock(27102026)')
    await c.query(
        'CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())'
    )
    for (const name of (await readdir('db/migrations'))
        .filter((n) => n.endsWith('.sql'))
        .sort()) {
        const sql = await readFile('db/migrations/' + name, 'utf8')
        const hash = createHash('sha256').update(sql).digest('hex')
        const exists = await c.query(
            'SELECT checksum FROM schema_migrations WHERE name=$1',
            [name]
        )
        if (exists.rowCount) {
            if (exists.rows[0].checksum !== hash)
                throw Error('Migration checksum mismatch')
            continue
        }
        await c.query('BEGIN')
        try {
            await c.query(sql)
            await c.query(
                'INSERT INTO schema_migrations(name,checksum) VALUES($1,$2)',
                [name, hash]
            )
            await c.query('COMMIT')
            console.log('Applied', name)
        } catch (error) {
            await c.query('ROLLBACK')
            throw error
        }
    }
    await c.query('GRANT USAGE ON SCHEMA public TO asiamotors')
    await c.query(
        'GRANT SELECT,INSERT,UPDATE,DELETE ON countries,cars,media,leads,mail_outbox,request_limits TO asiamotors'
    )
} catch {
    console.error('Database migration failed')
    process.exitCode = 1
} finally {
    await c.query('SELECT pg_advisory_unlock(27102026)').catch(() => {})
    c.release()
    await db.end()
}
