'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    FaCar,
    FaCarAlt,
    FaCogs,
    FaShippingFast,
    FaFileContract,
    FaShieldAlt,
} from 'react-icons/fa'

const services = [
    {
        id: 1,
        icon: <FaCar className="w-12 h-12" />,
        title: 'Новые автомобили из Китая',
        description:
            'Поможем выбрать и привезти новый автомобиль из Китая. Работаем напрямую с официальными дилерами.',
        link: '/services/new-cars',
        stats: '500+ доставленных авто',
    },
    {
        id: 2,
        icon: <FaCarAlt className="w-12 h-12" />,
        title: 'Подержанные авто из Китая',
        description:
            'Проверенные подержанные автомобили с гарантией технического состояния и юридической чистоты. Видео/Фото отчет до покупки',
        link: '/services/used-cars',
        stats: '300+ довольных клиентов',
    },
    {
        id: 3,
        icon: <FaCogs className="w-12 h-12" />,
        title: 'Новые запчасти для любых авто',
        description:
            'Оригинальные запчасти для ЛЮБЫХ автомобилей с доставкой по всей России.',
        link: '/spares',
        stats: '10000+ наименований',
    },
    {
        id: 4,
        icon: <FaShippingFast className="w-12 h-12" />,
        title: 'Доставка автомобилей',
        description:
            'Быстрая и безопасная доставка автомобилей из Китая. Полное страхование груза.',
        link: '/services/delivery',
        stats: 'От 20 дней',
    },
    {
        id: 5,
        icon: <FaFileContract className="w-12 h-12" />,
        title: 'Таможенное оформление',
        description:
            'Полное таможенное оформление автомобилей под ключ. Все документы и сертификаты.',
        link: '/services/customs',
        stats: '100% успешных сделок',
    },
    {
        id: 6,
        icon: <FaShieldAlt className="w-12 h-12" />,
        title: 'Страхование автомобилей',
        description:
            'Комплексное страхование автомобилей на выгодных условиях от ведущих страховых компаний.',
        link: '/services/insurance',
        stats: 'Выгода до 15%',
    },
]

const ServicesPage = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            {/* Вводный текст */}
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-red-600 bg-clip-text text-transparent mt-10">
                    Услуги Asia Motors
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Предоставляем полный спектр услуг по импорту автомобилей из
                    Китая. Гарантируем качество, надежность и прозрачность на
                    каждом этапе сотрудничества.
                </p>
            </div>

            {/* Сетка услуг */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-gray-700 to-red-600 text-white text-sm py-1 px-3 rounded-bl-lg rounded-tr-xl">
                            {service.stats}
                        </div>

                        <div className="text-orange-600 group-hover:text-secondary transition-colors duration-300">
                            {service.icon}
                        </div>

                        <h3 className="text-xl font-bold mt-4 mb-3">
                            {service.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {service.description}
                        </p>

                        <Link
                            href={service.link}
                            className="inline-flex items-center text-[#2F3136] hover:text-secondary transition-colors duration-300"
                        >
                            Подробнее
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default ServicesPage
