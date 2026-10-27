// Run against the isolated Compose test database, never production.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { pool } from '../scripts/runtime.mjs'

assert.equal(process.env.PGHOST, '127.0.0.1', 'Use the isolated local test database')
assert.equal(process.env.PGPORT, '35432', 'Use the isolated local test database')
const db = pool()
const client = await db.connect()
const ids = []
const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3110'
const insert = `INSERT INTO cars(country_id,brand,model,year,category,price,specs)
                VALUES('japan','Publication test','Fixture',2020,'sedan',1000000,'{}') RETURNING *`
try {
    // Reproduce a populated installation upgrading from the original schema.
    await client.query('BEGIN')
    const schema = 'publication_test_' + randomUUID().replaceAll('-', '')
    await client.query(`CREATE SCHEMA ${schema}`)
    await client.query(`SET LOCAL search_path TO ${schema}`)
    await client.query(await readFile('db/migrations/001_initial.sql', 'utf8'))
    const existing = (await client.query(insert)).rows[0]
    await client.query(await readFile('db/migrations/002_car_publication.sql', 'utf8'))
    const backfill = (await client.query('SELECT status,version FROM cars WHERE id=$1', [existing.id])).rows[0]
    assert.deepEqual(backfill, { status: 'published', version: 1 })
    const added = (await client.query(insert)).rows[0]
    assert.equal(added.status, 'draft')
    assert.equal(added.version, 1)
    assert.equal((await client.query("SELECT is_nullable FROM information_schema.columns WHERE table_schema=$1 AND table_name='cars' AND column_name='year'", [schema])).rows[0].is_nullable, 'NO')
    await client.query('SAVEPOINT invalid_status')
    await assert.rejects(client.query("UPDATE cars SET status='invalid'"), { code: '23514' })
    await client.query('ROLLBACK TO SAVEPOINT invalid_status')
    await client.query('SAVEPOINT invalid_version')
    await assert.rejects(client.query('UPDATE cars SET version=0'), { code: '23514' })
    await client.query('ROLLBACK')

    // Exercise the actual public route, including its explicit public projection.
    for (const status of ['published', 'hidden', 'draft']) {
        const car = (await client.query(`INSERT INTO cars(country_id,brand,model,year,category,price,specs,images,status)
            VALUES('japan','Publication test','Fixture',2020,'sedan',1000000,$1,$2,'draft') RETURNING *`, [
            JSON.stringify({mileage:0,engineVolume:2,horsePower:150,fuelType:'Бензин',transmission:'Автомат',driveType:'Передний'}),
            ['/media/' + randomUUID() + '.webp'],
        ])).rows[0]
        ids.push(car.id)
        await client.query('UPDATE cars SET status=$1 WHERE id=$2', [status, car.id])
    }
    const response = await fetch(baseUrl + '/api/catalog')
    assert.equal(response.status, 200)
    const { cars } = await response.json()
    const visible = cars.filter(car => ids.includes(car.id))
    assert.deepEqual(visible.map(car => car.id), [ids[0]])
    assert.equal('status' in visible[0], false)
    assert.equal('version' in visible[0], false)
    console.log('PASS: publication backfill, draft default, constraints and public visibility')
} finally {
    await client.query('ROLLBACK').catch(() => {})
    await client.query('DELETE FROM public.cars WHERE id=ANY($1::uuid[])', [ids])
    client.release()
    await db.end()
}
