'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import GlobalSpinner from '../features/GlobalSpinner/GlobalSpinner'

const LoadingContext = createContext({
    isLoading: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setIsLoading: (_value: boolean) => {},
})

export const LoadingProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const searchParams = useSearchParams()

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
    }, [pathname, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading && <GlobalSpinner />}
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => useContext(LoadingContext)
