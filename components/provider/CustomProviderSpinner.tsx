'use client'

import { useEffect, useState } from 'react'
import GlobalSpinner from '../features/GlobalSpinner/GlobalSpinner'
import { LoadingContext } from './LoadingContext'

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
            {isLoading && <GlobalSpinner />}
            {children}
        </LoadingContext.Provider>
    )
}
