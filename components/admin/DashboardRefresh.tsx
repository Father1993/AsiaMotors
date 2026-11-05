'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export function DashboardRefresh() {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    return (
        <button
            type="button"
            className="admin-button"
            disabled={pending}
            aria-busy={pending}
            onClick={() => startTransition(() => router.refresh())}
        >
            <ArrowPathIcon aria-hidden="true" />
            <span role="status">{pending ? 'Обновление…' : 'Обновить'}</span>
        </button>
    )
}
