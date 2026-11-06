import 'server-only'
import { z } from 'zod'
import { POPULAR_CARS_LIMIT } from '@/shared/constants/popular-cars'
import { database } from './db'
import { HttpError } from './http'

type Choice = {
    id: string
    brand: string
    model: string
    year: number | null
    status: 'published' | 'draft' | 'hidden'
    featured_position: number | null
}

export async function listPopularCarChoices() {
    const { rows } = await database().query<Choice>(`
        SELECT id, brand, model, year, status, featured_position
        FROM cars WHERE status = 'published' OR featured_position IS NOT NULL
        ORDER BY featured_position NULLS LAST, brand, model, year DESC, id
    `)
    return rows
}

const order = z.array(z.uuid()).max(POPULAR_CARS_LIMIT)
    .refine((ids) => new Set(ids).size === ids.length, 'Автомобиль указан дважды')
const updateOrder = z.object({ ids: order, previous: order })

export async function savePopularCars(input: unknown) {
    const { ids, previous } = updateOrder.parse(input)
    const client = await database().connect()
    try {
        await client.query('BEGIN')
        // Serialize changes to the selection, including saves when it is empty.
        await client.query('SELECT pg_advisory_xact_lock(27102027)')
        const { rows } = await client.query<Pick<Choice, 'id' | 'status' | 'featured_position'>>(`
            SELECT id, status, featured_position FROM cars
            WHERE featured_position IS NOT NULL OR id = ANY($1::uuid[])
            ORDER BY id FOR UPDATE
        `, [ids])
        const current = rows
            .filter((car) => car.featured_position !== null)
            .sort((a, b) => a.featured_position! - b.featured_position!)
            .map((car) => car.id)
        if (JSON.stringify(current) !== JSON.stringify(previous) && JSON.stringify(current) !== JSON.stringify(ids))
            throw new HttpError(409, 'Подборка изменилась. Обновите страницу и проверьте порядок.')
        const eligible = new Set(rows
            .filter((car) => car.status === 'published' || car.featured_position !== null)
            .map((car) => car.id))
        if (ids.some((id) => !eligible.has(id)))
            throw new HttpError(409, 'Автомобиль скрыт или удалён. Обновите страницу и проверьте подборку.')

        await client.query('UPDATE cars SET featured_position = NULL WHERE featured_position IS NOT NULL')
        await client.query(`
            UPDATE cars SET featured_position = selected.position
            FROM unnest($1::uuid[]) WITH ORDINALITY AS selected(id, position)
            WHERE cars.id = selected.id
        `, [ids])
        await client.query('COMMIT')
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}
