'use client'

import { ReactNode } from 'react'
import Popup from '../features/Popup/Popup'
import { create } from 'zustand'

interface ModalStore {
    isPopupOpen: boolean
    openPopup: () => void
    closePopup: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
    isPopupOpen: false,
    openPopup: () => set({ isPopupOpen: true }),
    closePopup: () => set({ isPopupOpen: false }),
}))

interface ModalProviderProps {
    children: ReactNode
}

const ModalProvider = ({ children }: ModalProviderProps) => {
    const { isPopupOpen, closePopup } = useModalStore()

    return (
        <>
            {children}
            <Popup isOpen={isPopupOpen} onClose={closePopup} />
        </>
    )
}

export default ModalProvider
