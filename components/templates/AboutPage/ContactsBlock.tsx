'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FaWhatsapp, FaTelegramPlane, FaUser, FaPhoneAlt } from 'react-icons/fa'
import { errorVariants } from '@/shared/constants/common'

// Динамическая загрузка с отключением SSR
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

    // Хук для предотвращения гидратационной ошибки
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Функция валидации имени
    const validateName = (value: string) => {
        const nameRegex = /^[А-Яа-яЁёA-Za-z\s-]{2,50}$/

        if (!value.trim()) {
            setNameError('Введите имя')
            return false
        }

        if (!nameRegex.test(value)) {
            setNameError(
                'Имя может содержать русские, английские буквы, пробелы и дефисы'
            )
            return false
        }

        setNameError('')
        return true
    }

    // Функция обработки изменения имени
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const sanitizedName = e.target.value.replace(
            /[^А-Яа-яЁёA-Za-z\s-]/g,
            ''
        )
        setName(sanitizedName)
        validateName(sanitizedName)
    }

    // Обработка изменения номера телефона
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputPhone = e.target.value

        // Если пользователь пытается удалить номер полностью
        if (inputPhone.length <= 2) {
            setPhone('+7 ')
            setPhoneError('Номер телефона должен содержать 11 цифр')
            return
        }

        const formattedPhone = formatPhoneNumber(inputPhone)

        setPhone(formattedPhone)
        validatePhone(formattedPhone)
    }

    // Обновленная функция форматирования номера телефона
    const formatPhoneNumber = (value: string) => {
        const phoneDigits = value.replace(/\D/g, '')

        if (phoneDigits.length === 0) return '+7 '

        // Различные варианты форматирования в зависимости от длины
        if (phoneDigits.length <= 1) return `+7 (${phoneDigits}`
        if (phoneDigits.length <= 4) return `+7 (${phoneDigits.slice(1, 4)}`
        if (phoneDigits.length <= 7)
            return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}`
        if (phoneDigits.length <= 9)
            return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(
                4,
                7
            )}-${phoneDigits.slice(7, 9)}`

        return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(
            4,
            7
        )}-${phoneDigits.slice(7, 9)}-${phoneDigits.slice(9)}`
    }

    // Функция валидации номера телефона
    const validatePhone = (value: string) => {
        const phoneDigits = value.replace(/\D/g, '')

        if (phoneDigits.length !== 11) {
            setPhoneError('Номер телефона должен содержать 11 цифр')
            return false
        }

        if (!['7', '8'].includes(phoneDigits[0])) {
            setPhoneError('Номер должен начинаться с 7 или 8')
            return false
        }

        setPhoneError('')
        return true
    }

    // Обработка отправки формы
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const isNameValid = validateName(name)
        const isPhoneValid = validatePhone(phone)

        if (isNameValid && isPhoneValid) {
            // Логика отправки заявки
            const cleanedPhone = phone.replace(/\D/g, '')
            console.log('Отправка заявки:', {
                name,
                phone: cleanedPhone,
            })
            // Здесь будет ваш API-запрос
        }
    }

    // Предотвращение гидратационной ошибки
    if (!isClient) {
        return null
    }
    return (
        <section className="bg-gradient-to-br from-red-500 to-red-800 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2"
                >
                    {/* Левая часть - форма */}
                    <div className="p-10 bg-gray-50">
                        <h3 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                            Получите консультацию за 1 минуту
                        </h3>
                        <p className="text-gray-600 mb-8">
                            Наши эксперты помогут подобрать идеальный автомобиль
                            из Китая с учетом ваших индивидуальных потребностей
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="Ваше имя"
                                    className={`
                                        w-full pl-10 pr-4 py-3 rounded-full border 
                                        ${
                                            nameError
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-red-500'
                                        }
                                        focus:outline-none focus:ring-2
                                    `}
                                />
                                {/* Контейнер с фиксированной высотой */}
                                <div className="h-6 mt-1">
                                    <AnimatePresence>
                                        {nameError && (
                                            <motion.p
                                                key="name-error"
                                                variants={errorVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="text-red-500 text-sm absolute"
                                            >
                                                {nameError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="relative">
                                <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+7 (___) ___-__-__"
                                    maxLength={18}
                                    className={`
                                                  w-full pl-10 pr-4 py-3 rounded-full border 
                                                  ${
                                                      phoneError
                                                          ? 'border-red-500 focus:ring-red-500'
                                                          : 'border-gray-300 focus:ring-red-500'
                                                  }
                                                  focus:outline-none focus:ring-2
                                              `}
                                />
                                {/* Контейнер с фиксированной высотой */}
                                <div className="h-6 mt-1">
                                    <AnimatePresence>
                                        {phoneError && (
                                            <motion.p
                                                key="phone-error"
                                                variants={errorVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="text-red-500 text-sm absolute"
                                            >
                                                {phoneError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:scale-105 transition-transform"
                            >
                                Получить бесплатную консультацию
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 mb-4">
                                Или свяжитесь мгновенно:
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href="https://wa.me/79999999999"
                                    target="_blank"
                                    className="text-green-500 hover:text-green-600"
                                >
                                    <FaWhatsapp className="w-8 h-8" />
                                </Link>
                                <Link
                                    href="https://t.me/asiamotors_bot"
                                    target="_blank"
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <FaTelegramPlane className="w-8 h-8" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть - менеджер */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative overflow-hidden"
                    >
                        <DynamicImage
                            src="/img/team/Mihail.png"
                            alt="Михаил Ананьев - менеджер по продажам"
                            width={500}
                            height={700}
                            className="w-full h-full object-cover absolute inset-0"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-6 text-white">
                            <h4 className="text-2xl font-bold">
                                Михаил Ананьев
                            </h4>
                            <p className="text-sm">
                                Менеджер отдела продаж, автоэксперт на портале
                                <Link
                                    href="https://www.dvhab.ru/"
                                    className="text-blue-500 hover:text-blue-600 font-bold underline"
                                >
                                    {' '}
                                    DVHAB.RU
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default ContactsBlock
