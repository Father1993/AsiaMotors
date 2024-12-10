export interface OrderCarModalProps {
    isOpen: boolean
    onClose: () => void
    car: {
        brand: string
        model: string
        year: number
    }
}
