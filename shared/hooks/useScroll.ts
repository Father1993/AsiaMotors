import { useState, useEffect } from 'react'

interface ScrollOptions {
    threshold?: number
    passive?: boolean
}

export const useScroll = ({
    threshold = 20,
    passive = true,
}: ScrollOptions = {}) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > threshold)
        }

        // Инициализация состояния
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [threshold, passive])

    return isScrolled
}
