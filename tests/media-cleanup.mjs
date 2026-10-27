import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdtemp, readFile, writeFile, access, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import pg from 'pg'
import { dbConfig } from '../scripts/runtime.mjs'
import { cleanOrphanMedia } from '../scripts/media-cleanup.mjs'

assert.equal(process.env.PGHOST, '127.0.0.1')
assert.equal(process.env.PGPORT, '35432')
const owner = new pg.Pool(dbConfig())
const schema = 'media_test_' + randomUUID().replaceAll('-', '')
const directory = await mkdtemp(path.join(os.tmpdir(), 'asiamotors-media-'))
const db = new pg.Pool({ ...dbConfig(), options: '-c search_path=' + schema, max: 3 })
try {
    await owner.query(`CREATE SCHEMA ${schema}`)
    for (const name of ['001_initial.sql', '002_car_publication.sql']) {
        await db.query(await readFile('db/migrations/' + name, 'utf8'))
    }
    const filenames = Array.from({ length: 5 }, () => randomUUID() + '.webp')
    for (const [index, filename] of filenames.entries()) {
        await writeFile(path.join(directory, filename), 'synthetic image')
        await db.query("INSERT INTO media(filename,created_at) VALUES($1,now()-($2*interval '1 hour'))", [filename, index === 1 ? 1 : 48])
    }
    for (const [index, status] of [[2, 'draft'], [3, 'hidden']]) {
        await db.query(`INSERT INTO cars(country_id,brand,model,year,category,price,specs,images,status)
            VALUES('china','Cleanup','Fixture',2026,'Test',1,'{}',$1,$2)`, [['/media/' + filenames[index]], status])
    }
    // A save holding the media lock must be skipped, then retained after commit.
    const saving = await db.connect()
    try {
        await saving.query('BEGIN')
        await saving.query('SELECT 1 FROM media WHERE filename=$1 FOR UPDATE', [filenames[4]])
        await cleanOrphanMedia(db, directory)
        await saving.query(`INSERT INTO cars(country_id,brand,model,year,category,price,specs,images,status)
            VALUES('china','Concurrent','Save',2026,'Test',1,'{}',$1,'draft')`, [['/media/' + filenames[4]]])
        await saving.query('COMMIT')
    } finally {
        await saving.query('ROLLBACK').catch(() => {})
        saving.release()
    }
    await cleanOrphanMedia(db, directory)
    await assert.rejects(access(path.join(directory, filenames[0])))
    for (const filename of filenames.slice(1)) await access(path.join(directory, filename))
    assert.equal((await db.query('SELECT count(*)::int AS count FROM media')).rows[0].count, 4)
    console.log('PASS: orphan grace period, draft/hidden media and concurrent save survive cleanup')
} finally {
    await db.end()
    await owner.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`)
    await owner.end()
    await rm(directory, { recursive: true, force: true })
}
