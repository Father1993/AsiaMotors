'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaWhatsapp, FaTelegramPlane, FaHeadset } from 'react-icons/fa'

const Questions = () => {
    return (
        <section className="bg-gradient-to-br from-red-500 to-red-700 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="grid md:grid-cols-2 items-center">
                        {/* Левая часть с анимированной иконкой */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 flex justify-center items-center relative">
                            <div className="absolute inset-0 bg-red-50 opacity-50 animate-pulse"></div>
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                }}
                            >
                                <FaHeadset className="text-red-600 w-40 h-40 relative z-10" />
                            </motion.div>
                        </div>

                        {/* Правая часть с контентом */}
                        <div className="p-10 text-center md:text-left">
                            <h3 className="text-4xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                                Есть вопрос?
                            </h3>
                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                Наши эксперты готовы проконсультировать вас по
                                любым вопросам импорта автомобилей из Китая
                            </p>

                            <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
                                <Link
                                    href="https://wa.me/79999999999"
                                    target="_blank"
                                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                                >
                                    <FaWhatsapp className="w-6 h-6" />
                                    <span>WhatsApp</span>
                                </Link>
                                <Link
                                    href="https://t.me/asiamotors_bot"
                                    target="_blank"
                                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
                                >
                                    <FaTelegramPlane className="w-6 h-6" />
                                    <span>Telegram</span>
                                </Link>
                            </div>

                            <div className="mt-6 text-center md:text-left">
                                <Link
                                    href="/contact"
                                    className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:scale-105 transition-transform shadow-lg"
                                >
                                    Написать менеджеру
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Questions
