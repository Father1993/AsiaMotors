/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import GlobalSpinner from '../features/GlobalSpinner/GlobalSpinner'

const LoadingContext = createContext({
    isLoading: false,
    setIsLoading: (_value: boolean) => {},
})

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
    }, []) // Убрали зависимости pathname и searchParams

    // Добавляем обработчик изменения роута через MutationObserver
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                setIsLoading(false)
            })
        })

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        })

        return () => observer.disconnect()
    }, [])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading && <GlobalSpinner />}
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => useContext(LoadingContext)
