import { unlink } from 'node:fs/promises'
import path from 'node:path'

export async function cleanOrphanMedia(db, directory) {
    const client = await db.connect()
    try {
        await client.query('BEGIN')
        const { rows } = await client.query(`
            SELECT filename FROM media m
            WHERE created_at < now() - interval '24 hours'
              AND NOT EXISTS (SELECT 1 FROM cars c WHERE c.images @> ARRAY['/media/' || m.filename])
            FOR UPDATE OF m SKIP LOCKED`)
        for (const { filename } of rows) {
            if (!/^[0-9a-f-]{36}\.webp$/.test(filename)) continue
            // A save may have committed after the candidate query took its snapshot.
            const referenced = await client.query(
                'SELECT 1 FROM cars WHERE images @> ARRAY[$1] LIMIT 1',
                ['/media/' + filename]
            )
            if (referenced.rowCount) continue
            await unlink(path.join(directory, filename)).catch(error => {
                if (error.code !== 'ENOENT') throw error
            })
            await client.query('DELETE FROM media WHERE filename=$1', [filename])
        }
        await client.query('COMMIT')
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}
