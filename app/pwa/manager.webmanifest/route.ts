export function GET() {
    return Response.json(
        {
            id: '/admin',
            name: 'AsiaMotors — управление',
            short_name: 'AM Менеджер',
            description: 'Управление каталогом, статьями и заявками AsiaMotors',
            start_url: '/admin/dashboard',
            scope: '/',
            lang: 'ru',
            display: 'standalone',
            background_color: '#f5f6f8',
            theme_color: '#111827',
            icons: [
                {
                    src: '/pwa/manager-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any',
                },
                {
                    src: '/pwa/manager-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any',
                },
            ],
        },
        {
            headers: {
                'Content-Type': 'application/manifest+json',
                'Cache-Control': 'public, max-age=0, must-revalidate',
            },
        },
    )
}
