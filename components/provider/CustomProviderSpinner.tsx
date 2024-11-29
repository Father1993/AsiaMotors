'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import GlobalSpinner from '../features/GlobalSpinner/GlobalSpinner'
import { LoadingContext } from './LoadingContext'

// Отдельный компонент для клиентской логики
const ClientLoadingManager = ({
    children,
    setIsLoading,
}: {
    children: React.ReactNode
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

    return <>{children}</>
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
            <Suspense fallback={<GlobalSpinner />}>
                <ClientLoadingManager setIsLoading={setIsLoading}>
                    {isLoading && <GlobalSpinner />}
                    {children}
                </ClientLoadingManager>
            </Suspense>
        </LoadingContext.Provider>
    )
}
