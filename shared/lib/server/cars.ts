import 'server-only'
import { database } from './db'
import { HttpError } from './http'
import { carVersionSchema, parseCarInput } from '../car-schema'
import type { AdminCarRecord } from '@/shared/types/database.types'
import { z } from 'zod'
import type { QueryResultRow } from 'pg'

export function serializeCar(row: QueryResultRow): AdminCarRecord {
    return { ...parseCarInput(row), id: row.id, version: row.version, created_at: row.created_at.toISOString(), updated_at: row.updated_at.toISOString() }
}
export async function getAdminCar(id: string): Promise<AdminCarRecord> {
    z.uuid().parse(id)
    const { rows } = await database().query('SELECT * FROM cars WHERE id=$1', [id])
    if (!rows.length) throw new HttpError(404, 'Автомобиль не найден')
    return serializeCar(rows[0])
}
function conflict() {
    return new HttpError(409, 'Автомобиль уже изменён в другой вкладке. Откройте актуальную запись.')
}
export async function saveCar(input: unknown, id?: string) {
    const data = parseCarInput(input)
    const metadata = id
        ? z.object({ version: carVersionSchema }).parse(input)
        : z.object({ id: z.uuid() }).parse(input)
    if (id) z.uuid().parse(id)
    const client = await database().connect()
    try {
        await client.query('BEGIN')
        // A lost POST response must never make a retry overwrite the existing record.
        if ('id' in metadata) {
            const found = await client.query('SELECT * FROM cars WHERE id=$1', [metadata.id])
            if (found.rowCount) {
                await client.query('COMMIT')
                return serializeCar(found.rows[0])
            }
        } else {
            const current = await client.query('SELECT version FROM cars WHERE id=$1 FOR UPDATE', [id])
            if (!current.rowCount) throw new HttpError(404, 'Автомобиль не найден')
            if (current.rows[0].version !== metadata.version) throw conflict()
        }
        const filenames = [...new Set(data.images.map(path => path.slice('/media/'.length)))]
        const media = await client.query('SELECT filename FROM media WHERE filename=ANY($1::text[]) ORDER BY filename FOR UPDATE', [filenames])
        if (media.rowCount !== filenames.length)
            throw new HttpError(400, 'Фотография не найдена. Загрузите её заново.', { images: ['Фотография не найдена. Загрузите её заново.'] })
        const values = [data.country_id, data.brand, data.model, data.year, data.category,
            data.price, data.equipment, data.images, JSON.stringify(data.specs), data.available, data.status]
        const result = 'version' in metadata
            ? await client.query(`UPDATE cars SET country_id=$1,brand=$2,model=$3,year=$4,category=$5,price=$6,equipment=$7,images=$8,specs=$9,available=$10,status=$11,updated_at=now(),version=version+1 WHERE id=$12 AND version=$13 RETURNING *`, [...values, id, metadata.version])
            : await client.query(`INSERT INTO cars(country_id,brand,model,year,category,price,equipment,images,specs,available,status,id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT(id) DO NOTHING RETURNING *`, [...values, metadata.id])
        const row = result.rows[0] || (await client.query('SELECT * FROM cars WHERE id=$1', ['id' in metadata ? metadata.id : id])).rows[0]
        await client.query('COMMIT')
        return serializeCar(row)
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally { client.release() }
}
export async function changeCarStatus(id: string, input: unknown) {
    const { status, version } = z.object({ status: z.enum(['published', 'hidden']), version: carVersionSchema }).parse(input)
    const current = await getAdminCar(id)
    if (current.version !== version) throw conflict()
    return saveCar({ ...current, status, version }, id)
}
export async function deleteCar(id: string, input: unknown) {
    z.uuid().parse(id)
    const { version } = z.object({ version: carVersionSchema }).parse(input)
    const result = await database().query('DELETE FROM cars WHERE id=$1 AND version=$2', [id, version])
    if (!result.rowCount) { await getAdminCar(id); throw conflict() }
    return { ok: true }
}
