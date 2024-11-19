'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaHome, FaSearch, FaPhone } from 'react-icons/fa'

const NotFoundPages = () => {
    return (
        <div className="max-w-4xl w-full">
            <div className="relative">
                {/* Основной контент */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center"
                >
                    <h1 className="text-8xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text mb-6">
                        404
                        {/* Анимированная машина */}
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, type: 'spring' }}
                            className="flex justify-center"
                        >
                            <Image
                                src="/img/not-found.jpg"
                                alt="404 автомобиль"
                                width={250}
                                height={150}
                                className="w-auto h-auto rounded-full border-4 border-white/10 shadow-xl"
                                priority
                            />
                        </motion.div>
                    </h1>
                    <p className="text-2xl text-white/90 mb-8">
                        Похоже, ВЫ съехали с нужной дороги
                    </p>
                    <p className="text-lg text-white/70 mb-12">
                        Страница, которую вы ищете, не существует или была
                        перемещена
                    </p>

                    {/* Кнопки навигации */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <FaHome className="text-xl" />
                                На главную
                            </motion.button>
                        </Link>
                        <Link href="/catalog">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <FaSearch className="text-xl" />
                                Каталог авто
                            </motion.button>
                        </Link>
                        <Link href="/contacts">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <FaPhone className="text-xl" />
                                Связаться
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Анимированные элементы фона */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -z-10 top-1/2 left-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
                />
            </div>
        </div>
    )
}

export default NotFoundPages
