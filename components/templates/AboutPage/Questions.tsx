'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaWhatsapp, FaTelegramPlane, FaHeadset } from 'react-icons/fa'
import { BsArrowRight } from 'react-icons/bs'

const Questions = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <section className="relative py-24 overflow-hidden" id="contact-us">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/90 to-red-700/90" />
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'url("/img/patterns/circuit-board.svg")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '80px',
                }}
            />

            <div className="container relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Левая колонка */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center lg:text-left"
                        >
                            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                                Поддержка 24/7
                            </span>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Остались вопросы?
                                <span className="block text-2xl md:text-3xl mt-2 text-white/80">
                                    Мы всегда на связи!
                                </span>
                            </h2>

                            <p className="text-lg text-white/80 mb-8 leading-relaxed">
                                Наши эксперты готовы проконсультировать вас по
                                любым вопросам импорта автомобилей из Китая.
                                Выберите удобный способ связи
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="https://wa.me/79294156555"
                                    target="_blank"
                                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FaWhatsapp className="text-2xl" />
                                    <span>WhatsApp</span>
                                    <BsArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                </Link>

                                <Link
                                    href="https://t.me/asiamotors_su"
                                    target="_blank"
                                    className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FaTelegramPlane className="text-2xl" />
                                    <span>Telegram</span>
                                    <BsArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                            {/* 
                            <div className="mt-8">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-3 text-white/90 hover:text-white"
                                >
                                    <FaComments className="text-xl" />
                                    <span>Написать в чат поддержки</span>
                                    <BsArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div> */}
                        </motion.div>

                        {/* Правая колонка */}
                        <motion.div
                            variants={itemVariants}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl transform rotate-6" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl transform -rotate-3" />

                            <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-3xl">
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <FaHeadset className="text-white w-24 h-24" />
                                    </motion.div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-white/90">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-2xl">🚗</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Подбор автомобиля
                                            </h3>
                                            <p className="text-sm text-white/70">
                                                Поможем выбрать идеальный
                                                вариант
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-white/90">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-2xl">💰</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Расчет стоимости
                                            </h3>
                                            <p className="text-sm text-white/70">
                                                Полная калькуляция расходов
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-white/90">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-2xl">📋</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                Оформление
                                            </h3>
                                            <p className="text-sm text-white/70">
                                                Поможем с документами
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Questions
