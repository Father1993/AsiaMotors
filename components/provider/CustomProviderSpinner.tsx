'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import GlobalSpinner from '../features/GlobalSpinner/GlobalSpinner'
import { LoadingContext } from './LoadingContext'

// Отдельный компонент для клиентской логики
const ClientLoadingManager = ({
    setIsLoading,
}: {
    setIsLoading: (value: boolean) => void
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [pathname, searchParams, setIsLoading])

    return null
}

export const LoadingProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleLoad = () => {
            setIsLoading(false)
        }

        if (document.readyState === 'complete') {
            handleLoad()
        } else {
            window.addEventListener('load', handleLoad)
            return () => window.removeEventListener('load', handleLoad)
        }
    }, [])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            <Suspense fallback={null}>
                <ClientLoadingManager setIsLoading={setIsLoading} />
            </Suspense>
            {isLoading && <GlobalSpinner />}
            {children}
        </LoadingContext.Provider>
    )
}
