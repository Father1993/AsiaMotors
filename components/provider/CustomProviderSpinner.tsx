'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import GlobalSpinner from '../features/GlobalSpinner/GlobalSpinner'
import { LoadingContext } from './LoadingContext'

export const LoadingProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Обработка начальной загрузки
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

    // Обработка навигации между страницами
    useEffect(() => {
        setIsLoading(true)

        // Используем setTimeout для имитации минимального времени загрузки
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 300) // минимальное время показа спиннера

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading && <GlobalSpinner />}
            {children}
        </LoadingContext.Provider>
    )
}
