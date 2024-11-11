'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MOBILE_NAVIGATION } from '@/shared/constants/menuLinks'
import { MobileMenuProps } from '@/shared/types/common'

const MobileMenu = ({ onClose }: MobileMenuProps) => {
    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-lg"
        >
            <nav className="grid grid-cols-5 gap-2 px-4 pb-3 pt-5">
                {MOBILE_NAVIGATION.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-medium">
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </motion.div>
    )
}

export default MobileMenu
