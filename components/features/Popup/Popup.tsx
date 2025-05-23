/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiPhone, FiMapPin } from 'react-icons/fi'
import { PricePopupProps } from '@/shared/types/common'
import { useEmailService } from '@/shared/hooks/useEmailService'
import { emailConfig } from '@/shared/config/emailService'

const Popup = ({ isOpen, onClose }: PricePopupProps) => {
    // Заменяем локальное состояние на хук useEmailService
    const { formRef, isLoading, sendEmail } = useEmailService(emailConfig)
    const [consentChecked, setConsentChecked] = useState(false)

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

    // Обновляем handleSubmit для использования sendEmail из хука
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!consentChecked) {
            alert(
                'Пожалуйста, подтвердите согласие на обработку персональных данных'
            )
            return
        }

        const form = formRef.current
        if (!form) return

        // Создаем объект с данными формы
        const templateParams = {
            form_name: 'Форма расчета стоимости', // Указываем название формы
            user_name: form.user_name.value,
            user_phone: form.user_phone.value,
            user_city: form.user_city.value,
            car_model: form.car_model.value,
        }

        await sendEmail(onClose, templateParams)
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

                            <div className="flex items-start mt-4">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={consentChecked}
                                    onChange={() =>
                                        setConsentChecked(!consentChecked)
                                    }
                                    className="mt-1 h-4 w-4 border border-gray-300 rounded-sm text-red-600 
                                    focus:ring-red-500"
                                    required
                                />
                                <label
                                    htmlFor="consent"
                                    className="ml-2 block text-sm text-gray-600"
                                >
                                    Я согласен на{' '}
                                    <a
                                        href="/consent"
                                        target="_blank"
                                        className="text-red-500 hover:underline"
                                    >
                                        обработку персональных данных
                                    </a>{' '}
                                    и принимаю{' '}
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        className="text-red-500 hover:underline"
                                    >
                                        пользовательское соглашение
                                    </a>
                                </label>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading || !consentChecked}
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
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Popup
