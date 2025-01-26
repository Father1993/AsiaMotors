'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { AnimatedCounterProps } from '@/shared/types/common'

const AnimatedCounter = ({
    startValue,
    maxValue,
    interval = 10000,
    className = '',
}: AnimatedCounterProps) => {
    const [displayValue, setDisplayValue] = useState(0)
    const elementRef = useRef(null)
    const isInView = useInView(elementRef, {
        once: true,
        margin: '0px 0px -100px 0px', // Запускает анимацию когда элемент на 100px выше нижнего края экрана
    })
    const animationStarted = useRef(false)

    useEffect(() => {
        if (isInView && !animationStarted.current) {
            animationStarted.current = true

            animate(0, startValue, {
                duration: 2,
                ease: [0.43, 0.13, 0.23, 0.96], // Улучшенная функция плавности
                onUpdate: (latest) => {
                    setDisplayValue(Math.floor(latest))
                },
                onComplete: () => {
                    const timer = setInterval(() => {
                        setDisplayValue((prev) => {
                            if (prev >= maxValue) {
                                clearInterval(timer)
                                return prev
                            }
                            return prev + 1
                        })
                    }, interval)

                    return () => clearInterval(timer)
                },
            })
        }
    }, [isInView, startValue, maxValue, interval])

    return (
        <motion.span
            ref={elementRef}
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1,
                ease: 'easeOut',
            }}
        >
            {displayValue}+
        </motion.span>
    )
}

export default AnimatedCounter
