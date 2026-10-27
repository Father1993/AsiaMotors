import { readFile } from 'node:fs/promises'
import path from 'node:path'
export const runtime = 'nodejs'
export async function GET(
    _request: Request,
    context: { params: Promise<{ name: string }> }
) {
    const { name } = await context.params
    if (!/^[0-9a-f-]{36}\.webp$/.test(name))
        return new Response(null, { status: 404 })
    try {
        const bytes = await readFile(
            // Runtime volume, not a file to include in the standalone image.
            /* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || '/app/uploads', name)
        )
        return new Response(new Uint8Array(bytes), {
            headers: {
                'Content-Type': 'image/webp',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch {
        return new Response(null, { status: 404 })
    }
}
