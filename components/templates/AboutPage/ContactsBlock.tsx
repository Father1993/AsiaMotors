'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { IMaskInput } from 'react-imask'
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import { HiOutlineUser, HiOutlinePhone } from 'react-icons/hi'
import { useInView } from 'react-intersection-observer'
import toast from 'react-hot-toast'

const DynamicImage = dynamic(() => import('next/image'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
    ),
})

const ContactsBlock = () => {
    const [isClient, setIsClient] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [nameError, setNameError] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    })

    const validateForm = (): boolean => {
        let isValid = true

        // Валидация имени
        const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/
        const trimmedName = name.trim()

        if (trimmedName.length < 2) {
            setNameError('Имя должно содержать минимум 2 символа')
            isValid = false
        } else if (!nameRegex.test(trimmedName)) {
            setNameError('Имя может содержать только буквы и пробелы')
            isValid = false
        } else if (trimmedName.length > 50) {
            setNameError('Имя не должно превышать 50 символов')
            isValid = false
        } else {
            setNameError('')
        }

        // Валидация телефона
        if (phone.replace(/\D/g, '').length !== 11) {
            setPhoneError('Введите корректный номер телефона')
            isValid = false
        } else {
            setPhoneError('')
        }

        return isValid
    }

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Разрешаем только буквы и пробелы при вводе
        const value = e.target.value.replace(/[^а-яА-ЯёЁa-zA-Z\s]/g, '')
        setName(value)
        if (nameError) setNameError('')
    }
    const handlePhoneAccept = (value: string) => {
        setPhone(value)
        if (phoneError) setPhoneError('')
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm() || isSubmitting) return

        setIsSubmitting(true)

        try {
            // Здесь должна быть логика отправки формы на сервер
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Имитация запроса

            // Очистка формы после успешной отправки
            setName('')
            setPhone('')
            toast.success(
                'Форма успешно отправлена! Мы свяжемся с вами в ближайшее время',
                {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#10B981',
                        color: '#fff',
                        borderRadius: '1rem',
                    },
                }
            )
        } catch (error) {
            console.error('Ошибка при отправке формы:', error)
            toast.error(
                'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже',
                {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#EF4444',
                        color: '#fff',
                        borderRadius: '1rem',
                    },
                }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6 },
        },
    }

    return (
        <section className="relative min-h-screen py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10"></div>

            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="container mx-auto px-4 relative z-10"
            >
                <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <motion.div
                            variants={itemVariants}
                            className="p-12 lg:p-16"
                        >
                            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-6">
                                Начните свой путь к идеальному авто
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 mt-12"
                            >
                                <div className="relative group">
                                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-xl group-focus-within:text-red-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="Ваше имя"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                    {nameError && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {nameError}
                                        </p>
                                    )}
                                </div>

                                <div className="relative group">
                                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-xl group-focus-within:text-red-500 transition-colors" />
                                    <IMaskInput
                                        mask="+{7} (000) 000-00-00"
                                        value={phone}
                                        onAccept={handlePhoneAccept}
                                        placeholder="+7 (___) ___-__-__"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                    {phoneError && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {phoneError}
                                        </p>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-medium shadow-xl shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? 'Отправка...'
                                        : 'Получить консультацию'}
                                </motion.button>
                            </form>

                            <div className="mt-12">
                                <p className="text-white/60 text-center mb-6">
                                    Или свяжитесь напрямую:
                                </p>
                                <div className="flex justify-center space-x-6">
                                    <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        href="https://wa.me/+79999999999"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <FaWhatsapp className="text-2xl text-white" />
                                    </motion.a>
                                    <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        href="https://t.me/username"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <FaTelegramPlane className="text-2xl text-white" />
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className="relative lg:h-auto">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                            {isClient && (
                                <DynamicImage
                                    src="/img/team/Mihail.png"
                                    alt="Михаил Ананьев Азиа Моторс"
                                    width={800}
                                    height={1000}
                                    className="w-full h-full object-cover"
                                    quality={75}
                                    loading="lazy"
                                />
                            )}
                            <motion.div
                                variants={itemVariants}
                                className="absolute bottom-0 left-0 right-0 p-8 z-20"
                            >
                                <h3 className="text-3xl font-bold text-white mb-2">
                                    Михаил Ананьев
                                </h3>
                                <p className="text-white/80">
                                    Ведущий эксперт по подбору автомобилей
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default ContactsBlock
