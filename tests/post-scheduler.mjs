import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {readFile} from 'node:fs/promises'
import pg from 'pg'
import {dbConfig} from '../scripts/runtime.mjs'
import {publishScheduledPosts} from '../scripts/post-scheduler.mjs'
assert.equal(process.env.PGHOST,'127.0.0.1')
assert.equal(process.env.PGPORT,'35432')
const owner=new pg.Pool(dbConfig())
const schema='schedule_test_'+randomUUID().replaceAll('-','')
const db=new pg.Pool({...dbConfig(),options:'-c search_path='+schema,max:5})
const original={title:'Frozen scheduled title',cover:'',content:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Original scheduled snapshot'}]}]}}
const edited={...original,title:'Later working draft'}
try{
 await owner.query(`CREATE SCHEMA ${schema}`)
 for(const migration of ['001_initial.sql','004_posts.sql','005_post_scheduling.sql'])await db.query(await readFile('db/migrations/'+migration,'utf8'))
 const id=randomUUID()
 await db.query(`INSERT INTO posts(id,slug,draft,scheduled_document,scheduled_at) VALUES($1,'frozen-test',$2,$3,now()-interval '1 minute')`,[id,JSON.stringify(edited),JSON.stringify(original)])
 const results=await Promise.all([publishScheduledPosts(db),publishScheduledPosts(db),publishScheduledPosts(db)])
 assert.equal(results.reduce((sum,n)=>sum+n,0),1)
 let row=(await db.query('SELECT * FROM posts WHERE id=$1',[id])).rows[0]
 assert.equal(row.version,2)
 assert.equal(row.published.title,original.title)
 assert.equal(row.draft.title,edited.title)
 assert.equal(row.scheduled_at,null)
 assert.equal(row.status,'published')
 assert.equal(await publishScheduledPosts(db),0)
 assert.equal((await db.query('SELECT version FROM posts WHERE id=$1',[id])).rows[0].version,2)
 await db.query(`UPDATE posts SET scheduled_document=$2,scheduled_at=now()+interval '1 hour' WHERE id=$1`,[id,JSON.stringify(edited)])
 assert.equal(await publishScheduledPosts(db),0)
 // Cancellation wins if it obtains the row lock before a due worker.
 await db.query("UPDATE posts SET scheduled_at=now()-interval '1 minute' WHERE id=$1",[id])
 const cancelling=await db.connect()
 try{
  await cancelling.query('BEGIN')
  await cancelling.query('SELECT id FROM posts WHERE id=$1 FOR UPDATE',[id])
  assert.equal(await publishScheduledPosts(db),0)
  await cancelling.query('UPDATE posts SET scheduled_at=NULL,scheduled_document=NULL,version=version+1 WHERE id=$1',[id])
  await cancelling.query('COMMIT')
 }finally{await cancelling.query('ROLLBACK');cancelling.release()}
 assert.equal(await publishScheduledPosts(db),0)
 row=(await db.query('SELECT * FROM posts WHERE id=$1',[id])).rows[0]
 assert.equal(row.published.title,original.title)
 assert.equal(row.version,3)
 const media=Array.from({length:3},()=>randomUUID()+'.webp')
 for(const file of media)await db.query('INSERT INTO media(filename) VALUES($1)',[file])
 const updatingId=randomUUID()
 const oldPublished={...original,title:'Old public version',cover:'/media/'+media[0]}
 const scheduled={...original,cover:'/media/'+media[1]}
 const working={...edited,cover:'/media/'+media[2]}
 await db.query(`INSERT INTO posts(id,slug,draft,published,status,published_at,scheduled_at,scheduled_document)
 VALUES($1,'scheduled-update',$2,$3,'published',now()-interval '1 day',now()-interval '1 minute',$4)`,[updatingId,JSON.stringify(working),JSON.stringify(oldPublished),JSON.stringify(scheduled)])
 for(const file of media)await db.query('INSERT INTO post_media(post_id,filename) VALUES($1,$2)',[updatingId,file])
 // Simulate the older rollback web omitting the frozen snapshot reference.
 await db.query('DELETE FROM post_media WHERE post_id=$1 AND filename=$2',[updatingId,media[1]])
 const firstDate=(await db.query('SELECT published_at FROM posts WHERE id=$1',[updatingId])).rows[0].published_at.toISOString()
 assert.equal(await publishScheduledPosts(db),1)
 const updated=(await db.query('SELECT * FROM posts WHERE id=$1',[updatingId])).rows[0]
 assert.equal(updated.published_at.toISOString(),firstDate)
 assert.equal(updated.published.cover,scheduled.cover)
 assert.equal(updated.draft.cover,working.cover)
 assert.deepEqual((await db.query('SELECT filename FROM post_media WHERE post_id=$1 ORDER BY filename',[updatingId])).rows.map(r=>r.filename),media.slice(1).sort())
 console.log('Frozen snapshot, concurrent workers, retry, future time and cancellation lock: PASS')
}finally{await db.end();await owner.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);await owner.end()}
