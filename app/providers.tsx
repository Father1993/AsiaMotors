'use client'

import { SessionProvider } from 'next-auth/react'
import { LoadingContext } from '@/components/provider/LoadingContext'
import ModalProvider from '@/components/provider/ModalProvider'
import { ReactNode } from 'react'

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
