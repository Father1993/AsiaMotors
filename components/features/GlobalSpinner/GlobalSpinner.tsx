'use client'

import { motion } from 'framer-motion'

const GlobalSpinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
            <motion.div
                className="w-16 h-16 border-4 border-[#2F3136] rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="absolute text-[#2F3136] mt-24 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Загрузка...
            </motion.div>
        </div>
    )
}

export default GlobalSpinner
