'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaShieldAlt, FaCarCrash, FaHandshake } from 'react-icons/fa'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { INSURANCE } from '@/shared/constants/breadcrumbs'

const insurancePartners = [
    {
        name: 'Альфастрахование',
        logo: '/img/insurance/alpha.png',
        description: 'Ведущая страховая компания России',
    },
    {
        name: 'Ингосстрах',
        logo: '/img/insurance/ingo.png',
        description: 'Надежная защита вашего автомобиля',
    },
    {
        name: 'РЕСО-Гарантия',
        logo: '/img/insurance/reso.png',
        description: 'Комплексные страховые решения',
    },
]

const benefits = [
    {
        icon: <FaShieldAlt className="w-8 h-8" />,
        title: 'Полная защита',
        description: 'Комплексное страховое покрытие для вашего автомобиля',
    },
    {
        icon: <FaCarCrash className="w-8 h-8" />,
        title: 'Быстрые выплаты',
        description: 'Оперативное урегулирование страховых случаев',
    },
    {
        icon: <FaHandshake className="w-8 h-8" />,
        title: 'Выгодные условия',
        description: 'Специальные тарифы для клиентов Asia Motors',
    },
]

const InsurancePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <Breadcrumbs items={INSURANCE} />

                {/* Hero секция */}
                <div className="relative rounded-3xl overflow-hidden mb-16">
                    <div className="absolute inset-0">
                        <Image
                            src="/img/bg-insurance.jpg"
                            alt="Страхование автомобилей"
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
                                Страхование автомобилей с Asia Motors
                            </h1>
                            <p className="text-xl text-gray-200 mb-8">
                                Обеспечьте надежную защиту вашего автомобиля с
                                помощью наших партнеров - ведущих страховых
                                компаний России
                            </p>
                            {/* <a
                                href="tel:+79294156555"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <FaPhoneAlt />
                                Получить консультацию
                            </a> */}
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

                {/* Партнеры */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-12">
                        Наши страховые партнеры
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {insurancePartners.map((partner, index) => (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative h-24 mb-6">
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-2">
                                    {partner.name}
                                </h3>
                                <p className="text-gray-600">
                                    {partner.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA секция */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Нужна консультация по страхованию?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Наши специалисты помогут подобрать оптимальную программу
                        страхования
                    </p>
                    <a
                        href="tel:+79294156555"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300"
                    >
                        <FaPhoneAlt />
                        +7 (929) 415-65-55
                    </a>
                </motion.div> */}
            </div>
        </div>
    )
}

export default InsurancePage
