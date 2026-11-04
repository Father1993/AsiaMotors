import manifest from '@/shared/lib/pwa-manifest'
export function GET() {
    return Response.json(manifest(), {
        headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'public, max-age=0, must-revalidate',
        },
    })
}
