'use client'
import { FormEvent } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiSearch, FiShoppingCart } from 'react-icons/fi'
import {
    sparesAdvantages,
    sparesBenefits,
    sparesCategories,
} from '@/shared/constants/spares'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { SPARES } from '@/shared/constants/breadcrumbs'
import { useEmailService } from '@/shared/hooks/useEmailService'
import { sparesEmailConfig } from '@/shared/config/emailService'

const SparesPage = () => {
    const { formRef, isLoading, sendEmail } = useEmailService(sparesEmailConfig)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const form = formRef.current
        if (!form) return
        const templateParams = {
            form_name: 'Форма заказа запчастей',
            user_name: form.user_name.value,
            user_phone: form.user_phone.value,
            car_model: form.car_model.value,
            car_year: form.car_year.value,
            vin_number: form.vin_number.value,
            part_name: form.part_name.value,
            part_number: form.part_number.value,
            message: form.message.value,
        }
        await sendEmail(() => {
            form.reset()
        }, templateParams)
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
            <div className="container">
                <Breadcrumbs items={SPARES} />
            </div>

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <Image
                    src="/img/spares/spares-1.jpeg"
                    alt="Автозапчасти для китайских автомобилей"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                    >
                        Запчасти для китайских авто
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/90 mb-8"
                    >
                        Оригинальные детали с гарантией для Chery, Haval, Geely
                        и других марок
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Введите название или номер детали..."
                                // value={searchQuery}
                                // onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 backdrop-blur-sm
                                border-2 border-transparent focus:border-red-500 outline-none
                                text-gray-800 placeholder-gray-400 shadow-lg transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* More info block */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-center mb-16"
                    >
                        Уникальные преимущества работы с нами
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {sparesAdvantages.map((advantage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative group"
                            >
                                <div
                                    className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl 
                                transition-all duration-300 h-full transform group-hover:-translate-y-2"
                                >
                                    <div className="text-4xl mb-4 flex justify-center">
                                        {advantage.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-center">
                                        {advantage.title}
                                    </h3>
                                    <p className="text-gray-600 text-center mb-4">
                                        {advantage.description}
                                    </p>
                                    <div
                                        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-purple-500 
                                    transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Информационный блок о доставке */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 bg-white rounded-2xl p-8 shadow-xl"
                    >
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold mb-6 text-center">
                                Быстрая доставка по всей России
                            </h3>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1">
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3">
                                            <span className="text-green-500 text-xl">
                                                ✓
                                            </span>
                                            <span>
                                                Доставка из Китая всего за 2-3
                                                недели
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="text-green-500 text-xl">
                                                ✓
                                            </span>
                                            <span>
                                                Центр логистики в Уссурийске
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="text-green-500 text-xl">
                                                ✓
                                            </span>
                                            <span>
                                                Отправка в любой регион России
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="font-semibold mb-3">
                                            Почему это выгодно?
                                        </h4>
                                        <p className="text-gray-600">
                                            Благодаря прямым поставкам и
                                            собственному логистическому центру,
                                            мы предлагаем самые конкурентные
                                            цены на рынке. Экономия составляет
                                            до 40% по сравнению с покупкой
                                            аналогичных запчастей в России.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 mt-10">
                    Категории запчастей которые можно заказать через Asia Motors
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {sparesCategories.map((category) => (
                        <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl
                            transition-all cursor-pointer text-center"
                        >
                            <div className="text-3xl mb-3">{category.icon}</div>
                            <h3 className="font-medium">{category.name}</h3>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Почему выбирают нас
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {sparesBenefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-lg text-center"
                            >
                                <div className="text-4xl mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
                            Нужна помощь в подборе запчастей?
                        </h2>
                        <p className="text-xl mb-8 text-white/90 text-center">
                            Заполните форму, и наши специалисты подберут
                            необходимые детали
                        </p>

                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Марка и модель автомобиля *
                                    </label>
                                    <input
                                        type="text"
                                        name="car_model"
                                        placeholder="Например: Haval F7"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder-white/50 focus:outline-none focus:border-white
                            transition-colors"
                                        required
                                    />
                                </motion.div>

                                {/* Год выпуска */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Год выпуска *
                                    </label>
                                    <input
                                        type="text"
                                        name="car_year"
                                        placeholder="Например: 2021"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder-white/50 focus:outline-none focus:border-white
                            transition-colors"
                                        required
                                    />
                                </motion.div>
                            </div>

                            {/* VIN или номер кузова */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <label className="block text-white text-sm font-medium mb-2">
                                    VIN или номер кузова
                                </label>
                                <input
                                    type="text"
                                    name="vin_number"
                                    placeholder="Введите VIN или номер кузова"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                        text-white placeholder-white/50 focus:outline-none focus:border-white
                        transition-colors"
                                />
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Наименование запчасти */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Наименование запчасти *
                                    </label>
                                    <input
                                        type="text"
                                        name="part_name"
                                        placeholder="Например: Передний бампер"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder-white/50 focus:outline-none focus:border-white
                            transition-colors"
                                        required
                                    />
                                </motion.div>

                                {/* Заводской номер */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Заводской номер запчасти
                                    </label>
                                    <input
                                        type="text"
                                        name="part_number"
                                        placeholder="Если известен"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder-white/50 focus:outline-none focus:border-white
                            transition-colors"
                                    />
                                </motion.div>
                            </div>

                            {/* Контактные данные */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Ваше имя *
                                    </label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        placeholder="Как к вам обращаться"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder-white/50 focus:outline-none focus:border-white
                            transition-colors"
                                        required
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Телефон *
                                    </label>
                                    <input
                                        type="tel"
                                        name="user_phone"
                                        placeholder="+7 (___) ___-__-__"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                            text-white placeholder-white/50 focus:outline-none focus:border-white
                            transition-colors"
                                        required
                                    />
                                </motion.div>
                            </div>

                            {/* Сообщение */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <label className="block text-white text-sm font-medium mb-2">
                                    Введите комментарии
                                </label>
                                <input
                                    type="text"
                                    name="message"
                                    placeholder="Например: Нужно 5шт."
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                        text-white placeholder-white/50 focus:outline-none focus:border-white
                        transition-colors"
                                />
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex justify-center mt-8"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-white text-red-600 rounded-xl font-medium
                                    hover:bg-gray-100 transition-colors flex items-center gap-2
                                    disabled:opacity-70 disabled:cursor-not-allowed"
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
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
                                        <>
                                            <FiShoppingCart className="text-xl" />
                                            Отправить заявку
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>

                            <p className="text-white/70 text-sm text-center mt-4">
                                Нажимая кнопку, вы соглашаетесь с{' '}
                                <a
                                    href="/privacy"
                                    className="underline hover:text-white"
                                >
                                    политикой конфиденциальности
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SparesPage
