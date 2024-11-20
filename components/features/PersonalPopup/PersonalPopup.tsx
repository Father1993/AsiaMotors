'use client'

import { FormEvent, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiPhone, FiGift } from 'react-icons/fi'
import { PricePopupProps } from '@/shared/types/common'
import { useEmailService } from '@/shared/hooks/useEmailService'
import { emailConfig } from '@/shared/config/emailService'

const PersonalPopup = ({ isOpen, onClose }: PricePopupProps) => {
    const { formRef, isLoading, sendEmail } = useEmailService(emailConfig)

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
        await sendEmail(onClose)
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

                    <motion.div
                        id="customPopupPersonal"
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
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100
                            transition-colors duration-200"
                            aria-label="Закрыть окно"
                        >
                            <FiX className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <motion.div
                                    animate={{
                                        rotate: [0, -10, 10, -10, 10, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                    className="text-5xl mb-4"
                                >
                                    🎁
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                                    font-bold px-2 py-1 rounded-full"
                                >
                                    NEW
                                </motion.div>
                            </div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600
                                bg-clip-text text-transparent"
                            >
                                Получите специальное предложение
                            </motion.h3>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-4 space-y-2"
                            >
                                <p className="text-gray-600">
                                    Оставьте свои контакты и получите:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center justify-center gap-2">
                                        <FiGift className="text-red-500" />
                                        Персональную скидку до 10%
                                    </li>
                                    <li className="flex items-center justify-center gap-2">
                                        <FiGift className="text-purple-500" />
                                        Бесплатную консультацию эксперта
                                    </li>
                                    <li className="flex items-center justify-center gap-2">
                                        <FiGift className="text-blue-500" />
                                        Специальные условия доставки
                                    </li>
                                </ul>
                            </motion.div>
                        </div>

                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <FiUser
                                    className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 
                                    group-focus-within:text-red-500 transition-colors"
                                />
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

                            <div className="relative group">
                                <FiPhone
                                    className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 
                                    group-focus-within:text-red-500 transition-colors"
                                />
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

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600
                                text-white font-medium rounded-xl shadow-lg shadow-red-500/30
                                hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300
                                disabled:opacity-70 disabled:cursor-not-allowed
                                relative overflow-hidden group"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                                <span className="relative">
                                    {isLoading ? (
                                        <motion.div
                                            className="flex items-center justify-center gap-2"
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                        >
                                            <span>Отправка</span>
                                            <span className="tracking-wider">
                                                ...
                                            </span>
                                        </motion.div>
                                    ) : (
                                        'Получить предложение'
                                    )}
                                </span>
                            </motion.button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Отправляя форму, вы соглашаетесь с{' '}
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

export default PersonalPopup
