'use client'

import Link from 'next/link'
import { PhoneIcon } from '@heroicons/react/24/outline'
import Logo from '@/components/common/Logo/Logo'
import MobileMenu from './MobileMenu'
import ScrollToTop from '@/components/features/ScrollToTop/ScrollToTop'
import { useScroll } from '@/shared/hooks/useScroll'
import { NAVIGATION } from '@/shared/constants/menuLinks'

const Header = () => {
    const isScrolled = useScroll({ threshold: 20 })

    return (
        <>
            {/* Убираем header на мобильной версии */}
            <header className="hidden lg:block lg:mb-36">
                <div
                    className={`fixed w-full z-40 transition-all duration-300 backdrop-blur-md bg-white/70 ${
                        isScrolled
                            ? 'bg-white shadow-md py-0.5 lg:py-2'
                            : 'bg-transparent py-0 lg:py-4'
                    }`}
                >
                    <div className="container max-w-6xl mx-auto px-4">
                        <nav className="flex items-center justify-between">
                            <div className="w-[100px] lg:w-auto">
                                <Logo className="scale-75 lg:scale-100 origin-left" />
                            </div>

                            {/* Мобильная кнопка звонка */}
                            <div className="lg:hidden">
                                <a
                                    href="tel:+74212935555"
                                    className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                                >
                                    <PhoneIcon className="w-5 h-5" />
                                </a>
                            </div>

                            {/* Десктопное меню */}
                            <div className="hidden lg:flex items-center space-x-8">
                                {NAVIGATION.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Десктопные контакты */}
                            <div className="hidden lg:flex items-center space-x-6">
                                <div className="text-right">
                                    <a
                                        href="tel:+74212935555"
                                        className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors"
                                    >
                                        +7 (4212) 93-5555
                                    </a>
                                </div>
                                <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-colors">
                                    <PhoneIcon className="w-5 h-5" />
                                    <span>Заказать звонок</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Мобильное меню */}
            <div className="lg:hidden">
                <MobileMenu />
            </div>

            <ScrollToTop />
        </>
    )
}

export default Header
