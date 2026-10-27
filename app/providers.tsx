'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { toastConfig } from '@/shared/constants/common'

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            {children}
            <Toaster position="bottom-center" toastOptions={toastConfig} />
        </SessionProvider>
    )
}
