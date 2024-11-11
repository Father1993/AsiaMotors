'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useScroll } from '@/shared/hooks/useScroll'

const ScrollToTop = () => {
    const isVisible = useScroll({ threshold: 100 })

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    className="fixed bottom-[80px] right-4 z-[100] p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors duration-200 lg:bottom-8"
                    aria-label="Прокрутить наверх"
                >
                    <ChevronUpIcon className="w-6 h-6" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default ScrollToTop
