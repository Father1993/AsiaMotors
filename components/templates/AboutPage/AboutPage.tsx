'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { advantagesList, teamMembers } from '@/shared/constants/team'
import TestimonialsBlock from './TestimonialsBlock'
import Questions from './Questions'
import Social from './Social'
import VideoBlock from './VideoBlock'
import SuccessCase from './SuccessCase'
import ContactsBlock from './ContactsBlock'

const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-b from-white to-gray-50"
        >
            <div className="container mx-auto px-4 py-16">
                {/* Героический блок */}
                <section className="text-center mb-16">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
                    >
                        Asia Motors: Ваш проводник в мире китайских автомобилей
                    </motion.h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-700 mb-10 leading-relaxed">
                        Мы - профессиональная команда с собственными офисами в
                        Китае, которая делает покупку автомобиля максимально
                        простой, безопасной и выгодной
                    </p>
                    <Link
                        href="/contact"
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:scale-105 transition-transform shadow-lg"
                    >
                        Получить консультацию
                    </Link>
                </section>

                {/* Преимущества */}
                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        Почему выбирают нас
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {advantagesList.map((advantage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-center mb-4">
                                    {advantage.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">
                                    {advantage.title}
                                </h3>
                                <p className="text-gray-600">
                                    {advantage.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Команда */}
                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        Наша команда
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white rounded-2xl p-6 shadow-lg text-center"
                            >
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={300}
                                    height={300}
                                    className="rounded-full mx-auto mb-4 w-48 h-48 object-cover"
                                />
                                <h3 className="text-xl font-bold">
                                    {member.name}
                                </h3>
                                <p className="text-gray-600 mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {member.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Статистика */}
                <section className="bg-red-50 rounded-3xl p-12 text-center">
                    <h2 className="text-4xl font-bold mb-12 text-gray-800">
                        Наши достижения
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { value: '270+', label: 'Довольных клиентов' },
                            { value: '2', label: 'Года на рынке' },
                            { value: '100%', label: 'Гарантия на всех этапах' },
                            { value: '24/7', label: 'Поддержка' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-5xl font-bold text-red-600 mb-4">
                                    {stat.value}
                                </div>
                                <p className="text-gray-700">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <TestimonialsBlock />
            <Questions />
            <Social />
            <VideoBlock />
            <SuccessCase />
            <ContactsBlock />
        </motion.div>
    )
}

export default AboutPage
