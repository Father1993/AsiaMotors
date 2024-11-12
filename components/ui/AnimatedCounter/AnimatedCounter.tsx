'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedCounterProps } from '@/shared/types/common'

const AnimatedCounter = ({
    startValue,
    maxValue,
    interval = 10000,
    className = '',
}: AnimatedCounterProps) => {
    const [count, setCount] = useState(startValue)

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => (prev < maxValue ? prev + 1 : prev))
        }, interval)

        return () => clearInterval(timer)
    }, [maxValue, interval])

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={count}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={className}
            >
                {count}+
            </motion.span>
        </AnimatePresence>
    )
}

export default AnimatedCounter
