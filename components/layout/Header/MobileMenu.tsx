'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MOBILE_NAVIGATION,
    ModalMobileMenu,
} from '@/shared/constants/menuLinks'
import { MobileMenuProps } from '@/shared/types/common'
import { XMarkIcon } from '@heroicons/react/24/outline'

const MobileMenu = ({ onClose }: MobileMenuProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleLinkClick = () => {
        setIsMenuOpen(false)
        onClose?.()
    }

    return (
        <>
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-40 shadow-2xl w-full max-w-[100vw] overflow-visible rounded-t-3xl border-t border-gray-100"
            >
                <nav className="grid grid-cols-5 gap-3 px-4 pb-6 pt-5">
                    {MOBILE_NAVIGATION.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.name}
                                onClick={
                                    item.isMenu
                                        ? handleMenuClick
                                        : () => {
                                              handleLinkClick()
                                              if (!item.isMenu) {
                                                  window.location.href =
                                                      item.href
                                              }
                                          }
                                }
                                className="group flex flex-col items-center gap-1.5 text-gray-600 transition-all duration-200 active:scale-95"
                            >
                                <div className="relative">
                                    <Icon className="w-6 h-6 transition-transform duration-200 group-hover:scale-110 group-hover:text-red-600" />
                                    {item.isMenu && isMenuOpen && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                                        />
                                    )}
                                </div>
                                <span className="text-[11px] font-medium text-center group-hover:text-red-600">
                                    {item.name}
                                </span>
                            </button>
                        )
                    })}
                </nav>
            </motion.div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed bottom-[85px] left-4 right-4 bg-gradient-to-b from-white/95 to-white/98 backdrop-blur-xl z-50 shadow-lg py-3 rounded-2xl border border-gray-100"
                    >
                        <div className="flex justify-between items-center px-6 pb-4 border-b border-gray-100">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Меню
                            </h3>
                            <button
                                onClick={handleMenuClick}
                                className="p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 active:scale-95"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                        <nav className="flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto px-2">
                            {ModalMobileMenu.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className="flex items-center px-4 py-3.5 my-0.5 text-gray-600 hover:text-red-600 rounded-xl hover:bg-gray-50/80 active:bg-gray-100 transition-all duration-200"
                                >
                                    <span className="text-[15px] font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default MobileMenu
