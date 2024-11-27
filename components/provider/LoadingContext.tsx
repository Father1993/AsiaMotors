/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createContext } from 'react'

export const LoadingContext = createContext({
    isLoading: true,
    setIsLoading: (_value: boolean) => {},
})
