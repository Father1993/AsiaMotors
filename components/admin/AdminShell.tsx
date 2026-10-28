'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { createContext, useContext, useState } from 'react'

const NavigationContext = createContext<{ dirty: boolean; setDirty: (value: boolean) => void }>({
    dirty: false,
    setDirty: () => {},
})
export const useAdminNavigation = () => useContext(NavigationContext)
export function confirmLeave() {
    return window.confirm('Есть несохранённые изменения. Покинуть редактор?')
}
export function clearCarRecovery() {
    for (const key of Object.keys(sessionStorage)) {
        if (key.startsWith('asiamotors:car:')) sessionStorage.removeItem(key)
    }
}

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
    const pathname = usePathname()
    const [dirty, setDirty] = useState(false)
    return (
        <NavigationContext.Provider value={{ dirty, setDirty }}>
            <div className="admin-shell">
                <a href="#admin-content" className="admin-skip">
                    К содержимому
                </a>
                <header className="admin-header">
                    <Link
                        href="/admin"
                        className="admin-logo"
                        onNavigate={(e) => {
                            if (dirty && !confirmLeave()) e.preventDefault()
                        }}
                    >
                        <Image
                            src="/img/asia-motors-logo.png"
                            alt="AsiaMotors"
                            width={48}
                            height={48}
                            loading="eager"
                            className="object-contain shrink-0"
                        />
                        <span>Управление сайтом</span>
                    </Link>
                    <nav aria-label="Администрирование" className="admin-nav">
                        {[
                            ['/admin', 'Автомобили'],
                            ['/admin/requests', 'Заявки'],
                            ['/admin/blog', 'Блог'],
                        ].map(([href, label]) => (
                            <Link
                                key={href}
                                href={href}
                                aria-current={
                                    (
                                        href === '/admin'
                                            ? pathname === '/admin' || pathname.startsWith('/admin/cars')
                                            : pathname.startsWith(href)
                                    )
                                        ? 'page'
                                        : undefined
                                }
                                onNavigate={(e) => {
                                    if (dirty && !confirmLeave()) e.preventDefault()
                                }}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                    <div className="admin-account">
                        <span className="admin-muted admin-email">{email}</span>
                        <a href="/" target="_blank" rel="noopener noreferrer">
                            Открыть сайт ↗
                        </a>
                        <button
                            className="admin-button admin-button-quiet"
                            onClick={() => {
                                if (dirty && !confirmLeave()) return
                                clearCarRecovery()
                                void signOut({ callbackUrl: '/auth/signin' })
                            }}
                        >
                            Выйти
                        </button>
                    </div>
                </header>
                <main id="admin-content" className="admin-main">
                    {children}
                </main>
            </div>
        </NavigationContext.Provider>
    )
}
