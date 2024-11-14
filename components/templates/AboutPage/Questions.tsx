'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaCommentDots, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'

const Questions = () => {
    return (
        <section className="bg-gradient-to-br from-red-500 to-red-700 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="grid md:grid-cols-2 items-center">
                        {/* Левая часть с иконкой */}
                        <div className="bg-red-50 p-8 flex justify-center items-center">
                            <FaCommentDots className="text-red-600 w-32 h-32 animate-bounce" />
                        </div>

                        {/* Правая часть с контентом */}
                        <div className="p-8 text-center md:text-left">
                            <h3 className="text-3xl font-bold mb-4 text-gray-800">
                                Есть вопрос?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Задайте его нашему менеджеру онлайн прямо сейчас
                            </p>

                            <div className="flex justify-center md:justify-start space-x-4">
                                <Link
                                    href="https://wa.me/79999999999"
                                    target="_blank"
                                    className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                                >
                                    <FaWhatsapp className="w-6 h-6" />
                                </Link>
                                <Link
                                    href="https://t.me/asiamotors_bot"
                                    target="_blank"
                                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                                >
                                    <FaTelegramPlane className="w-6 h-6" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
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
