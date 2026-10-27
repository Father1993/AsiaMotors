import type { Metadata } from 'next'
import '../admin/admin.css'
export const metadata: Metadata = { robots: { index: false, follow: false } }
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="admin-shell">{children}</div>
}
