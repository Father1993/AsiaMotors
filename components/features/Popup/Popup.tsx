/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { FormEvent, useRef, useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiPhone, FiMapPin } from 'react-icons/fi'
import { PricePopupProps } from '@/shared/types/common'

const Popup = ({ isOpen, onClose }: PricePopupProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await emailjs.sendForm(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                formRef.current!,
                'YOUR_PUBLIC_KEY'
            )
            toast.success('Заявка успешно отправлена!')
            onClose()
        } catch (error) {
            toast.error('Произошла ошибка при отправке')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] overflow-hidden flex items-center justify-center"
                    />

                    {/* Popup */}
                    <motion.div
                        id="customPopup"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-lg
                          bg-white rounded-3xl shadow-2xl z-[1000]
                          overflow-y-auto max-h-[90vh]
                          p-6 md:p-8
                          flex flex-col"
                        style={{
                            margin: 'auto',
                            position: 'fixed',
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100
                            transition-colors duration-200"
                        >
                            <FiX className="w-6 h-6" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h3
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600
                            bg-clip-text text-transparent"
                            >
                                Узнайте стоимость автомобиля
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Заполните форму, и мы свяжемся с вами в
                                ближайшее время
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <FiUser className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="user_name"
                                    placeholder="Ваше имя"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none
                                    transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <FiPhone className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input
                                    type="tel"
                                    name="user_phone"
                                    placeholder="Номер телефона"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none
                                    transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <FiMapPin className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="user_city"
                                    placeholder="Ваш город"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none
                                    transition-all duration-200"
                                />
                            </div>

                            <div className="relative">
                                <FiMapPin className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="car_model"
                                    placeholder="Интересующая модель"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none
                                    transition-all duration-200"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600
                                text-white font-medium rounded-xl shadow-lg shadow-red-500/30
                                hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300
                                disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: 'linear',
                                            }}
                                        >
                                            ⚡
                                        </motion.span>
                                        Отправка...
                                    </span>
                                ) : (
                                    'Отправить заявку'
                                )}
                            </motion.button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Нажимая кнопку, вы соглашаетесь с{' '}
                                <a
                                    href="/privacy"
                                    className="text-red-500 hover:underline"
                                >
                                    политикой конфиденциальности
                                </a>
                            </p>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Popup
