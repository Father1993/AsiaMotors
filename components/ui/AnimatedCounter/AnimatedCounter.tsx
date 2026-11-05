'use client'
import { useState, useEffect, useRef } from 'react'
import { useInView, useReducedMotion, animate } from 'framer-motion'
import { AnimatedCounterProps } from '@/shared/types/common'

const AnimatedCounter = ({ value, duration = 4, className = '' }: AnimatedCounterProps) => {
    const [displayValue, setDisplayValue] = useState(value)
    const elementRef = useRef<HTMLSpanElement>(null)
    const isInView = useInView(elementRef, { once: true })
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        if (!isInView || reducedMotion !== false) return
        const animation = animate(0, value, {
            duration, ease: 'easeOut',
            onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        })
        return () => animation.stop()
    }, [isInView, value, duration, reducedMotion])

    return (
        <span ref={elementRef} className={className}>
            <span className="sr-only">{value}+</span>
            <span aria-hidden="true">{reducedMotion ? value : displayValue}+</span>
        </span>
    )
}
export default AnimatedCounter
