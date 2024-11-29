/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable max-len */
import { Suspense } from 'react'
import { Metadata } from 'next'
import NotFoundPages from '@/components/common/NotFoundPages/NotFoundPages'
import GlobalSpinner from '@/components/features/GlobalSpinner/GlobalSpinner'

export const metadata: Metadata = {
    title: 'Страница не найдена | AsiaMotors',
    description:
        'К сожалению, запрашиваемая страница не найдена. Вернитесь на главную страницу AsiaMotors для поиска нужной информации',
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: '404 - Страница не найдена | AsiaMotors',
        description:
            'Извините, запрашиваемая страница не существует. Вернитесь на главную AsiaMotors для информации. Азиа моторс. АзиаМоторс',
        type: 'website',
        url: 'https://AsiaMotors.ru/404',
        images: [
            {
                url: '/img/404-og-image.jpg',
                width: 1200,
                height: 630,
                alt: '404 - Страница не найдена | AsiaMotors',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: '404 - Страница не найдена | AsiaMotors',
        description:
            'Упс! Страница, которую вы ищете, не существует. Вернитесь на главную AsiaMotors',
        images: '/img/android-chrome-192x192.png',
    },
}

const NotFound = () => (
    <Suspense fallback={<GlobalSpinner />}>
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <NotFoundPages />
        </main>
    </Suspense>
)

export default NotFound
