'use client'

import { FormEvent, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi'
import { PricePopupProps } from '@/shared/types/common'
import { useEmailService } from '@/shared/hooks/useEmailService'
import { emailConfig } from '@/shared/config/emailService'

const QuestionPopup = ({ isOpen, onClose }: PricePopupProps) => {
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

        const templateParams = {
            form_name: 'Форма вопроса',
            user_name: form.user_name.value,
            user_phone: form.user_phone.value,
            message: form.message.value,
        }

        await sendEmail(() => {
            onClose()
            setConsentChecked(false)
        }, templateParams)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] overflow-hidden flex items-center justify-center"
                    />

                    <motion.div
                        id="customPopupQuestion"
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
                            <span className="inline-block animate-bounce mb-4 text-4xl">
                                ❓
                            </span>
                            <h3
                                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600
                                bg-clip-text text-transparent"
                            >
                                Не нашли ответ на свой вопрос?
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Наши эксперты ответят на все ваши вопросы в
                                течение 24 часов
                            </p>
                        </div>

                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <FiUser
                                    className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 
                                    group-focus-within:text-blue-500 transition-colors"
                                />
                                <input
                                    type="text"
                                    name="user_name"
                                    placeholder="Ваше имя"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                                    transition-all duration-200"
                                />
                            </div>

                            <div className="relative group">
                                <FiPhone
                                    className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 
                                    group-focus-within:text-blue-500 transition-colors"
                                />
                                <input
                                    type="tel"
                                    name="user_phone"
                                    placeholder="Номер телефона"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                                    transition-all duration-200"
                                />
                            </div>

                            <div className="relative group">
                                <FiMessageSquare
                                    className="absolute top-4 left-4 text-gray-400 
                                    group-focus-within:text-blue-500 transition-colors"
                                />
                                <textarea
                                    name="message"
                                    placeholder="Ваш вопрос"
                                    required
                                    rows={4}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
                                    transition-all duration-200 resize-none"
                                />
                            </div>

                            <div className="flex items-start mt-4">
                                <input
                                    type="checkbox"
                                    id="question_consent"
                                    checked={consentChecked}
                                    onChange={() =>
                                        setConsentChecked(!consentChecked)
                                    }
                                    className="mt-1 h-4 w-4 border border-gray-300 rounded-sm text-blue-600 
                                    focus:ring-blue-500"
                                    required
                                />
                                <label
                                    htmlFor="question_consent"
                                    className="ml-2 block text-sm text-gray-600"
                                >
                                    Я согласен на{' '}
                                    <a
                                        href="/consent"
                                        target="_blank"
                                        className="text-blue-500 hover:underline"
                                    >
                                        обработку персональных данных
                                    </a>{' '}
                                    и принимаю{' '}
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        className="text-blue-500 hover:underline"
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
                                    'Задать вопрос'
                                )}
                            </motion.button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Отправляя форму, вы соглашаетесь с{' '}
                                <a
                                    href="/privacy"
                                    className="text-blue-500 hover:underline"
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

export default QuestionPopup
