import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { pool } from '../scripts/runtime.mjs'
assert.equal(process.env.PGHOST, '127.0.0.1')
assert.equal(process.env.PGPORT, '35432')
const db = pool()
const client = await db.connect()
try {
    await client.query('BEGIN')
    const schema = 'draft_migration_' + randomUUID().replaceAll('-', '')
    await client.query(`CREATE SCHEMA ${schema}`)
    await client.query(`SET LOCAL search_path TO ${schema}`)
    for (const name of ['001_initial.sql', '002_car_publication.sql'])
        await client.query(await readFile('db/migrations/' + name, 'utf8'))
    const bad = (await client.query(`INSERT INTO cars(country_id,brand,model,year,category,price,specs,status)
        VALUES('japan','Existing','Bad',2020,'sedan',1000000,'{}','published') RETURNING id`)).rows[0].id
    const migration = await readFile('db/migrations/003_car_drafts.sql', 'utf8')
    await client.query('SAVEPOINT preflight')
    await assert.rejects(client.query(migration), error => error.message.includes(bad))
    await client.query('ROLLBACK TO SAVEPOINT preflight')
    await client.query(`UPDATE cars SET specs=$1,images=$2 WHERE id=$3`, [
        JSON.stringify({ mileage: 1, engineVolume: 2, horsePower: 150, fuelType: 'Бензин', transmission: 'Автомат', driveType: 'Передний' }),
        ['/media/' + randomUUID() + '.webp'], bad,
    ])
    await client.query(migration)
    const existing = (await client.query('SELECT * FROM cars WHERE id=$1', [bad])).rows[0]
    assert.equal(existing.status, 'published')
    assert.equal(existing.version, 1)
    assert.equal(existing.price, 1000000)
    const draft = (await client.query("INSERT INTO cars(brand,model) VALUES('Partial','Draft') RETURNING *")).rows[0]
    assert.equal(draft.status, 'draft')
    assert.equal(draft.country_id, null)
    assert.equal(draft.year, null)
    assert.equal(draft.price, null)
    assert.deepEqual(draft.specs, {})
    await client.query('SAVEPOINT incomplete')
    await assert.rejects(client.query("UPDATE cars SET status='published' WHERE id=$1", [draft.id]), { code: '23514' })
    await client.query('ROLLBACK TO SAVEPOINT incomplete')
    console.log('PASS: populated migration preserves records, rejects invalid publication with ID, permits drafts and blocks incomplete publication')
} finally {
    await client.query('ROLLBACK')
    client.release()
    await db.end()
}
