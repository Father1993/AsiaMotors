import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/shared/lib/auth/auth-options'
import { AdminShell } from '@/components/admin/AdminShell'
import './admin.css'
import './workspace.css'

export const metadata: Metadata = {
    title: 'Управление сайтом | AsiaMotors',
    robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) redirect('/auth/signin')
    return <AdminShell email={session.user.email || ''}>{children}</AdminShell>
}
