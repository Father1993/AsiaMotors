import 'server-only'
import { database } from './db'
import { carInput } from './validation'
import { HttpError } from './http'
import { z } from 'zod'
export async function saveCar(input: unknown, id?: string) {
    const data = carInput.parse(input)
    if (id) z.uuid().parse(id)
    const client = await database().connect()
    try {
        await client.query('BEGIN')
        const filenames = [
            ...new Set(data.images.map((p) => p.slice('/media/'.length))),
        ]
        const media = await client.query(
            'SELECT filename FROM media WHERE filename=ANY($1::text[]) FOR UPDATE',
            [filenames]
        )
        if (media.rowCount !== filenames.length)
            throw new HttpError(
                400,
                'Фотография не найдена. Загрузите её заново.'
            )
        const values = [
            data.country_id,
            data.brand,
            data.model,
            data.year,
            data.category,
            data.price,
            data.equipment,
            data.images,
            JSON.stringify(data.specs),
            data.available,
        ]
        const result = id
            ? await client.query(
                  `UPDATE cars SET country_id=$1,brand=$2,model=$3,year=$4,category=$5,price=$6,equipment=$7,images=$8,specs=$9,available=$10,updated_at=now(),version=version+1 WHERE id=$11 RETURNING *`,
                  [...values, id]
              )
            : await client.query(
                  `INSERT INTO cars(country_id,brand,model,year,category,price,equipment,images,specs,available,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'published') RETURNING *`,
                  values
              )
        if (!result.rowCount) throw new HttpError(404, 'Автомобиль не найден')
        await client.query('COMMIT')
        return result.rows[0]
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}
