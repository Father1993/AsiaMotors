'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { LoadingContext } from '@/components/provider/LoadingContext'
import ModalProvider from '@/components/provider/ModalProvider'

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <LoadingContext.Provider
                value={{ isLoading: false, setIsLoading: () => {} }}
            >
                <ModalProvider>{children}</ModalProvider>
            </LoadingContext.Provider>
        </SessionProvider>
    )
}
