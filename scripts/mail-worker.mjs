import nodemailer from 'nodemailer'
import { pool } from './runtime.mjs'
import { readFileSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
const db = pool()
const smtp = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: process.env.SMTP_USER
        ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD_FILE
                  ? readFileSync(process.env.SMTP_PASSWORD_FILE, 'utf8').trim()
                  : process.env.SMTP_PASSWORD,
          }
        : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
})
if (process.argv.includes('--verify')) {
    try {
        await smtp.verify()
        console.log('SMTP authentication verified')
    } catch (e) {
        console.error('SMTP verification failed', e.code || 'unknown')
        process.exitCode = 1
    }
    await db.end()
} else {
    let stop = false
    process.on('SIGTERM', () => {
        stop = true
    })
    process.on('SIGINT', () => {
        stop = true
    })
    let maintenanceAt = 0
    async function tick() {
        const c = await db.connect()
        try {
            await c.query('BEGIN')
            const { rows } =
                await c.query(`SELECT o.id,o.lead_id,o.attempts,l.payload FROM mail_outbox o JOIN leads l ON l.id=o.lead_id
              WHERE o.status='pending' AND o.next_attempt_at<=now() ORDER BY o.next_attempt_at FOR UPDATE OF o SKIP LOCKED LIMIT 1`)
            if (rows[0]) {
                const item = rows[0]
                try {
                    const labels = {
                        form_name: 'Форма',
                        user_name: 'Имя',
                        user_phone: 'Телефон',
                        user_city: 'Город',
                        car_model: 'Автомобиль',
                        message: 'Сообщение',
                        car_year: 'Год',
                        vin_number: 'VIN',
                        part_name: 'Запчасть',
                        part_number: 'Артикул',
                    }
                    const text = [
                        'Заявка № ' + item.lead_id,
                        ...Object.entries(labels)
                            .filter(([k]) => item.payload[k])
                            .map(
                                ([k, label]) => label + ': ' + item.payload[k]
                            ),
                    ].join('\n')
                    const recipient = process.env.MAIL_TO || 'asia-social@ya.ru'
                    const result = await smtp.sendMail({
                        from: {
                            name: 'AsiaMotors — заявки',
                            address:
                                process.env.MAIL_FROM ||
                                process.env.SMTP_USER ||
                                'test@localhost',
                        },
                        to: recipient,
                        subject: 'AsiaMotors: ' + item.payload.form_name,
                        messageId: `<lead-${item.lead_id}@asiamotors.su>`,
                        text,
                    })
                    if (!result.accepted?.length)
                        throw Object.assign(Error(), { code: 'EREJECTED' })
                    await c.query(
                        `UPDATE mail_outbox SET status='sent',sent_at=now(),last_error=NULL WHERE id=$1`,
                        [item.id]
                    )
                } catch (error) {
                    const attempts = item.attempts + 1
                    const code = /^[A-Z0-9_]{1,30}$/.test(error.code || '')
                        ? error.code
                        : 'SMTP_ERROR'
                    await c.query(
                        `UPDATE mail_outbox SET attempts=$2,status=$3,last_error=$4,next_attempt_at=now()+($5*interval '1 second') WHERE id=$1`,
                        [
                            item.id,
                            attempts,
                            attempts >= 12 ? 'failed' : 'pending',
                            code,
                            Math.min(3600, 30 * 2 ** Math.min(attempts, 7)),
                        ]
                    )
                    console.error('Mail delivery deferred', code)
                }
            }
            await c.query('COMMIT')
        } catch (error) {
            await c.query('ROLLBACK')
            throw error
        } finally {
            c.release()
        }
    }
    async function maintenance() {
        const days = Number(process.env.LEAD_RETENTION_DAYS || 90)
        if (!Number.isInteger(days) || days < 1)
            throw Error('Invalid retention')
        await db.query(
            `DELETE FROM leads WHERE created_at<now()-($1*interval '1 day')`,
            [days]
        )
        await db.query(
            `DELETE FROM request_limits WHERE window_start<now()-interval '1 day'`
        )
        // Remove orphan media only after a grace period; serialize with car saves.
        const c = await db.connect()
        try {
            await c.query('BEGIN')
            const files =
                await c.query(`SELECT filename FROM media m WHERE created_at<now()-interval '24 hours'
              AND NOT EXISTS(SELECT 1 FROM cars c WHERE c.images @> ARRAY['/media/'||m.filename]) FOR UPDATE SKIP LOCKED`)
            for (const f of files.rows) {
                if (!/^[0-9a-f-]{36}\.webp$/.test(f.filename)) continue
                await unlink(
                    path.join(
                        process.env.UPLOAD_DIR || '/app/uploads',
                        f.filename
                    )
                ).catch((e) => {
                    if (e.code !== 'ENOENT') throw e
                })
                await c.query('DELETE FROM media WHERE filename=$1', [
                    f.filename,
                ])
            }
            await c.query('COMMIT')
        } catch (e) {
            await c.query('ROLLBACK')
            throw e
        } finally {
            c.release()
        }
    }
    while (!stop) {
        try {
            await tick()
            if (Date.now() > maintenanceAt) {
                await maintenance()
                maintenanceAt = Date.now() + 3600000
            }
        } catch {
            console.error('Mail worker iteration failed')
        }
        if (!stop) await new Promise((r) => setTimeout(r, 2000))
    }
    smtp.close()
    await db.end()
}
