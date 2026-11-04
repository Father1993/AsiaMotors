import { readFile } from 'node:fs/promises'
import path from 'node:path'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET() {
    const source = await readFile(
        /* turbopackIgnore: true */ path.join(
            process.cwd(),
            'public/pwa/worker.js',
        ),
        'utf8',
    )
    const build = await readFile(
        /* turbopackIgnore: true */ path.join(process.cwd(), '.next/BUILD_ID'),
        'utf8',
    ).catch(() => 'development')
    return new Response(
        source.replace(
            '__BUILD_ID__',
            build.trim().replace(/[^a-zA-Z0-9_-]/g, ''),
        ),
        {
            headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Cache-Control': 'no-store',
                'Service-Worker-Allowed': '/',
            },
        },
    )
}
