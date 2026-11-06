import 'server-only'
import { database } from './db'
import { publicCarInput, carAvailabilitySchema } from '../car-schema'
import type { AdminCarRecord } from '@/shared/types/database.types'
import type { Car, Country } from '@/shared/types/adminTypes'
import { z } from 'zod'
import { POPULAR_CARS_LIMIT } from '@/shared/constants/popular-cars'

export async function listPublishedCars(scope: 'catalog' | 'popular' = 'catalog'): Promise<Car[]> {
    const selection = scope === 'popular'
        ? `AND (featured_position IS NOT NULL OR NOT EXISTS (
            SELECT 1 FROM cars WHERE status = 'published' AND featured_position IS NOT NULL
        )) ORDER BY featured_position NULLS LAST, created_at DESC, id LIMIT ${POPULAR_CARS_LIMIT}`
        : 'ORDER BY created_at DESC, id'
    const { rows } = await database().query(`SELECT id,country_id,brand,model,year,category,price,equipment,
        images,specs,available,availability,created_at,updated_at FROM cars WHERE status='published' ${selection}`)
    return rows.map(row => ({ ...publicCarInput.parse(row), id: row.id,
        created_at: row.created_at.toISOString(), updated_at: row.updated_at.toISOString() }))
}
export async function listCountries(): Promise<Country[]> {
    return (await database().query('SELECT id,name FROM countries ORDER BY id')).rows
}
export async function listAdminCars(params: URLSearchParams) {
    const filters = z.object({
        q: z.string().trim().max(150).default(''),
        status: z.enum(['draft', 'published', 'hidden']).optional(),
        country: z.enum(['china', 'japan', 'korea', 'europe']).optional(),
        availability: carAvailabilitySchema.optional(),
        available: z.enum(['true', 'false']).optional(),
        page: z.coerce.number().int().min(1).max(1000000).default(1),
    }).parse(Object.fromEntries(params))
    const values: unknown[] = []
    const conditions: string[] = []
    for (const [column, value] of [['status', filters.status], ['country_id', filters.country], ['availability', filters.availability], ['available', filters.availability ? undefined : filters.available]] as const) {
        if (value !== undefined) { values.push(value); conditions.push(`${column}=$${values.length}`) }
    }
    if (filters.q) {
        values.push('%' + filters.q.replace(/[\\%_]/g, '\\$&') + '%')
        conditions.push(`concat_ws(' ',brand,model) ILIKE $${values.length}`)
    }
    const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''
    // A single statement keeps the count and page on the same database snapshot.
    const result = await database().query<{ cars: AdminCarRecord[]; total: number }>(`WITH filtered AS (SELECT * FROM cars${where})
        SELECT (SELECT count(*)::int FROM filtered) AS total,
        COALESCE((SELECT jsonb_agg(page) FROM (SELECT * FROM filtered ORDER BY updated_at DESC,id DESC LIMIT 25 OFFSET $${values.length + 1}) page),'[]'::jsonb) AS cars`, [...values, (filters.page - 1) * 25])
    return { cars: result.rows[0].cars, total: result.rows[0].total, page: filters.page, pageSize: 25 }
}
