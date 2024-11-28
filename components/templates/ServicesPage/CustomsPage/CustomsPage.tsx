'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaFileContract, FaCheckCircle, FaShieldAlt } from 'react-icons/fa'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { CUSTOMS } from '@/shared/constants/breadcrumbs'

const benefits = [
    {
        icon: <FaFileContract className="w-8 h-8" />,
        title: 'Полный комплекс услуг',
        description: 'Оформление всей необходимой документации под ключ',
    },
    {
        icon: <FaCheckCircle className="w-8 h-8" />,
        title: 'Легальность',
        description: 'Все процедуры в строгом соответствии с законодательством',
    },
    {
        icon: <FaShieldAlt className="w-8 h-8" />,
        title: 'Гарантия результата',
        description: 'Успешное оформление документов в установленные сроки',
    },
]

const services = [
    {
        title: 'Таможенное оформление автомобилей',
        description:
            'Полное сопровождение процесса растаможки автомобилей из Китая',
    },
    {
        title: 'Оформление СБКТС',
        description:
            'Получение свидетельства безопасности конструкции транспортного средства',
    },
    {
        title: 'Оформление ПТС',
        description: 'Помощь в получении паспорта транспортного средства',
    },
]

const CustomsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <Breadcrumbs items={CUSTOMS} />

                {/* Hero секция */}
                <div className="relative rounded-3xl overflow-hidden mb-16">
                    <div className="absolute inset-0">
                        <Image
                            src="/img/bg-customs.jpg"
                            alt="Таможенное оформление автомобилей"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    </div>

                    <div className="relative z-10 py-20 px-8 md:px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Таможенное оформление в Уссурийске
                            </h1>
                            <p className="text-xl text-gray-200 mb-8">
                                Профессиональная помощь в таможенном оформлении
                                автомобилей из Китая. Быстро, легально, с
                                гарантией результата.
                            </p>
                            <a
                                href="tel:+79294156555"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Получить консультацию
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Преимущества */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                                <div className="text-red-600">
                                    {benefit.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Услуги и цены */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Услуги и стоимость
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomsPage
