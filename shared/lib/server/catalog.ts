import 'server-only'
import { database } from './db'
import type { Car, Country } from '@/shared/types/adminTypes'
export async function listCars(): Promise<Car[]> {
    const { rows } = await database().query(
        'SELECT * FROM cars ORDER BY created_at DESC, id'
    )
    return rows.map((r) => ({
        ...r,
        created_at: r.created_at.toISOString(),
        updated_at: r.updated_at.toISOString(),
    }))
}
export async function listCountries(): Promise<Country[]> {
    return (await database().query('SELECT id,name FROM countries ORDER BY id'))
        .rows
}
