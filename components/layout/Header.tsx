'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: 'Как купить', href: '/how-to-buy' },
    { name: 'О компании', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
]

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Отслеживание скролла для изменения фона header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
            }`}
        >
            <div className="container-wrapper">
                <nav className="flex items-center justify-between">
                    {/* Логотип */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                            ASIA MOTORS
                        </span>
                    </Link>

                    {/* Десктопное меню */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Контакты и кнопка обратного звонка */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="text-right">
                            <a
                                href="tel:+78005553535"
                                className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors"
                            >
                                8 800 555 35 35
                            </a>
                            <p className="text-sm text-gray-500">
                                Ежедневно с 9:00 до 21:00
                            </p>
                        </div>
                        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors">
                            <PhoneIcon className="w-5 h-5" />
                            <span>Заказать звонок</span>
                        </button>
                    </div>

                    {/* Мобильная кнопка меню */}
                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </nav>

                {/* Мобильное меню */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden"
                        >
                            <div className="py-4 space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="px-4 py-4 border-t">
                                    <a
                                        href="tel:+78005553535"
                                        className="block text-lg font-semibold text-gray-900 mb-1"
                                    >
                                        8 800 555 35 35
                                    </a>
                                    <button className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors">
                                        <PhoneIcon className="w-5 h-5" />
                                        <span>Заказать звонок</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}

export default Header
