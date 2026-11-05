import { BRAND_ICONS, BRAND_FAVICONS } from '@/shared/constants/branding'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import PwaExperience from '@/components/pwa/PwaExperience'
import '../admin/admin.css'
export const metadata: Metadata = {
    manifest: '/pwa/manager.webmanifest',
    appleWebApp: { capable: true, title: 'AM Менеджер' },
    icons: { icon: BRAND_FAVICONS, apple: [{ url: BRAND_ICONS.managerApple, sizes: '180x180' }] },
    robots: { index: false, follow: false },
}
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="admin-shell manager-auth">
            <PwaExperience kind="manager" />
            <Suspense fallback={<p className="p-8">Загрузка…</p>}>
                {children}
            </Suspense>
        </div>
    )
}
