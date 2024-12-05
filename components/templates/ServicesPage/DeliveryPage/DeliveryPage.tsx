'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { DELIVERY_BREADCRUMBS } from '@/shared/constants/breadcrumbs'
import { advantages } from '@/shared/constants/services'

const DeliveryPage = () => {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50">
            <div className="container">
                <Breadcrumbs items={DELIVERY_BREADCRUMBS} />
            </div>
            {/* Hero секция */}
            <section className="relative h-[60vh] min-h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/img/bg-hero-delivery.jpg"
                        alt="Доставка автомобилей из Китая"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container relative z-10 mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl text-white"
                    >
                        <h1 className="text-5xl font-bold mb-6">
                            Профессиональная доставка автомобилей из Китая
                        </h1>
                        <p className="text-xl mb-8 text-gray-200">
                            От 20 дней с полным таможенным оформлением и
                            гарантией сохранности
                        </p>
                        <Link
                            href="/contacts"
                            className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                            Контакты
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Преимущества */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Почему выбирают нашу доставку
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {advantages.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <h3 className="text-xl font-semibold mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Процесс доставки */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Как происходит доставка
                    </h2>

                    <div className="max-w-4xl mx-auto">
                        {[
                            {
                                step: '01',
                                title: 'Оформление заказа',
                                description:
                                    'Заполняете форму или связываетесь с нами любым удобным способом',
                            },
                            {
                                step: '02',
                                title: 'Подготовка документов',
                                description:
                                    'Оформляем все необходимые документы для таможенного оформления',
                            },
                            {
                                step: '03',
                                title: 'Транспортировка',
                                description:
                                    'Доставляем автомобиль с соблюдением всех мер безопасности',
                            },
                            {
                                step: '04',
                                title: 'Получение',
                                description:
                                    'Передаем автомобиль и полный пакет документов',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex gap-8 mb-8"
                            >
                                <div className="flex-shrink-0 w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA секция */}
            <section className="py-20 bg-gray-900 text-white" id="delivery__bg">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Мы готовы доставить ваш автомобиль!
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Получите бесплатную консультацию и расчет стоимости
                        прямо сейчас
                    </p>
                    <button
                        // onClick={openPopup}
                        className="px-8 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                        Заказать доставку
                    </button>
                </div>
            </section>
        </div>
    )
}

export default DeliveryPage
