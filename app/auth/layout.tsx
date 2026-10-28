import type { Metadata } from 'next'
import { Suspense } from 'react'
import '../admin/admin.css'
export const metadata: Metadata = { robots: { index: false, follow: false } }
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="admin-shell">
            <Suspense fallback={<p className="p-8">Загрузка…</p>}>{children}</Suspense>
        </div>
    )
}
