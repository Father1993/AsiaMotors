// One atomic database publication per scheduled snapshot, even with multiple workers.
export async function publishScheduledPosts(db) {
    const client = await db.connect()
    try {
        await client.query('BEGIN')
        const { rows } = await client.query(`
            WITH due AS (SELECT id FROM posts WHERE scheduled_at<=now()
                ORDER BY scheduled_at,id FOR UPDATE SKIP LOCKED LIMIT 20)
            UPDATE posts p SET published=p.scheduled_document,status='published',
                published_at=COALESCE(p.published_at,now()),publication_updated_at=now(),
                scheduled_at=NULL,scheduled_document=NULL,version=version+1,updated_at=now()
            FROM due WHERE p.id=due.id RETURNING p.id,p.draft,p.published`)
        for (const post of rows) {
            const files = new Set()
            for (const doc of [post.draft,post.published]) {
                if (doc.cover) files.add(doc.cover.slice(7))
                const visit = node => {
                    if (node.type==='image') files.add(node.attrs.src.slice(7))
                    node.content?.forEach(visit)
                }
                visit(doc.content)
            }
            // Repair references if a compatible older web rebuilt only draft/public media.
            if(files.size) await client.query('INSERT INTO post_media(post_id,filename) SELECT $1,unnest($2::text[]) ON CONFLICT DO NOTHING',[post.id,[...files].sort()])
            await client.query('DELETE FROM post_media WHERE post_id=$1 AND NOT(filename=ANY($2::text[]))',[post.id,[...files]])
        }
        await client.query('COMMIT')
        return rows.length
    } catch (error) {
        await client.query('ROLLBACK')
        throw error
    } finally { client.release() }
}
