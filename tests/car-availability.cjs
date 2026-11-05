// Run only against a disposable local PostgreSQL instance, never the project .env.
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { randomUUID } = require('node:crypto')
const { execFileSync } = require('node:child_process')
assert.equal(process.env.PGHOST, '127.0.0.1')
assert.equal(process.env.PGPORT, '35433')
assert.equal(process.env.POSTGRES_DB, 'availability_test')
assert.equal(process.env.DATABASE_URL, undefined)
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
        module: 'CommonJS',
        moduleResolution: 'Node',
        jsx: 'react-jsx',
    },
})
require('tsconfig-paths/register')
require.cache[require.resolve('server-only')] = { exports: {} }
const { database } = require('../shared/lib/server/db.ts')
const { saveCar, changeCarStatus, getAdminCar } = require('../shared/lib/server/cars.ts')
const { listAdminCars, listPublishedCars } = require('../shared/lib/server/catalog.ts')
const { parseCarInput } = require('../shared/lib/car-schema.ts')
const { companyExperience } = require('../shared/constants/company.ts')
const { withCarAvailability } = require('../shared/constants/carAvailability.ts')
const db = database()
async function main() {
    await db.query('CREATE ROLE asiamotors')
    for (const name of ['001_initial.sql', '002_car_publication.sql', '003_car_drafts.sql'])
        await db.query(readFileSync('db/migrations/' + name, 'utf8'))
    const old = (
        await db.query(
            "INSERT INTO cars(brand,model,available) VALUES('Existing','Stock',true),('Existing','Order',false) RETURNING *",
        )
    ).rows
    await db.query(readFileSync('db/migrations/006_car_availability.sql', 'utf8'))
    for (const car of old) {
        const current = (await db.query('SELECT * FROM cars WHERE id=$1', [car.id])).rows[0]
        const { availability, ...preserved } = current
        assert.deepEqual(preserved, car)
        assert.equal(availability, car.available ? 'in_stock' : 'on_order')
    }
    // Re-run the real migrator twice on this populated database.
    await db.query(
        'DROP TRIGGER cars_sync_availability ON cars; DROP FUNCTION sync_car_availability(); ALTER TABLE cars DROP COLUMN availability',
    )
    await db.query(
        'CREATE TABLE schema_migrations(name text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())',
    )
    for (const name of ['001_initial.sql', '002_car_publication.sql', '003_car_drafts.sql']) {
        const checksum = require('node:crypto')
            .createHash('sha256')
            .update(readFileSync('db/migrations/' + name))
            .digest('hex')
        await db.query('INSERT INTO schema_migrations(name,checksum) VALUES($1,$2)', [
            name,
            checksum,
        ])
    }
    for (let i = 0; i < 2; i++)
        execFileSync(process.execPath, ['scripts/migrate.mjs'], {
            env: process.env,
            stdio: 'pipe',
        })
    assert.equal((await db.query('SELECT count(*)::int n FROM cars')).rows[0].n, 2)
    const photo = randomUUID() + '.webp'
    await db.query('INSERT INTO media(filename) VALUES($1)', [photo])
    const base = {
        brand: 'Availability',
        model: 'Test',
        country_id: 'china',
        year: 2026,
        price: 1000000,
        category: 'SUV',
        images: ['/media/' + photo],
        specs: {
            mileage: 0,
            engineVolume: 2,
            horsePower: 150,
            fuelType: 'Бензин',
            transmission: 'Автомат',
            driveType: 'Полный',
        },
        status: 'published',
    }
    let china
    for (const availability of ['in_stock', 'in_china', 'on_order']) {
        const id = randomUUID()
        const saved = await saveCar({ ...base, id, availability })
        assert.equal(saved.availability, availability)
        assert.equal(saved.available, availability !== 'on_order')
        assert.equal((await getAdminCar(id)).availability, availability)
        assert.equal((await saveCar({ ...base, id, availability })).version, 1)
        if (availability === 'in_china') china = saved
    }
    china = await saveCar({ ...china, price: 2000000 }, china.id)
    china = await changeCarStatus(china.id, {
        status: 'hidden',
        version: china.version,
    })
    assert.equal(china.availability, 'in_china')
    china = await changeCarStatus(china.id, {
        status: 'published',
        version: china.version,
    })
    assert.equal(china.availability, 'in_china')
    await assert.rejects(saveCar({ ...china, version: 1 }, china.id), {
        status: 409,
    })
    const { availability, ...legacy } = china
    await assert.rejects(saveCar(legacy, china.id), { status: 409 })
    // Old application updates unrelated fields without erasing the China location.
    await db.query('UPDATE cars SET price=3000000,available=true WHERE id=$1', [china.id])
    assert.equal((await getAdminCar(china.id)).availability, 'in_china')
    for (const [query, count] of [
        ['availability=in_china', 1],
        ['available=true', 2],
        ['available=false', 1],
    ]) {
        const result = await listAdminCars(new URLSearchParams('q=Availability&' + query))
        assert.equal(result.total, count)
    }
    assert.equal(
        (await listPublishedCars()).find((car) => car.id === china.id).availability,
        'in_china',
    )
    assert.throws(() => parseCarInput({ ...base, availability: 'bad' }))
    await assert.rejects(db.query("UPDATE cars SET availability='bad' WHERE id=$1", [china.id]), {
        code: '23514',
    })
    const restored = withCarAvailability({
        available: false,
        brand: 'Unsaved',
        specs: { mileage: 0 },
    })
    assert.equal(restored.availability, 'on_order')
    assert.equal(restored.brand, 'Unsaved')
    assert.equal(restored.specs.mileage, 0)
    for (const [date, years, label] of [
        ['2026-12-31T13:59:59Z', 4, 'года на рынке'],
        ['2026-12-31T14:00:00Z', 5, 'лет на рынке'],
        ['2033-01-01T00:00:00Z', 11, 'лет на рынке'],
        ['2043-01-01T00:00:00Z', 21, 'год на рынке'],
    ])
        assert.deepEqual(companyExperience(new Date(date)), { years, label })
    console.log(
        'PASS: populated migration, repeated migrator, three states, CRUD, legacy compatibility, conflicts, filters, recovery and year boundaries',
    )
}
main()
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(() => db.end())
