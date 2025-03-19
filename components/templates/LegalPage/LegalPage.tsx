'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import ArrowLeft from '@/components/ui/ArrowLeft'

// Интерфейс для юридических документов
interface LegalDocument {
    id: string
    title: string
    description: string
    path: string
    icon: JSX.Element
}

const LegalPage = () => {
    // Список всех юридических документов
    const legalDocuments: LegalDocument[] = [
        {
            id: 'terms',
            title: 'Пользовательское соглашение',
            description:
                'Условия использования сайта, права и обязанности пользователей, ответственность сторон.',
            path: '/terms',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'privacy',
            title: 'Политика конфиденциальности',
            description:
                'Правила сбора, обработки и хранения персональных данных пользователей сайта.',
            path: '/privacy',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'cookies',
            title: 'Политика использования cookies',
            description:
                'Информация о том, как сайт использует файлы cookies и как вы можете управлять ими.',
            path: '/privacy-policy',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'consent',
            title: 'Согласие на обработку данных',
            description:
                'Информация о согласии на обработку персональных данных пользователей.',
            path: '/consent',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'metrics',
            title: 'Согласие на метрические программы',
            description:
                'Информация о согласии на использование метрических программ для анализа взаимодействия пользователей с сайтом.',
            path: '/metrics-consent',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'recommendations',
            title: 'Рекомендательные технологии',
            description:
                'Информация о том, как работают рекомендательные технологии на сайте.',
            path: '/recommendations',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'marketing',
            title: 'Согласие на рекламную рассылку',
            description:
                'Информация о согласии пользователя на получение рекламных и информационных материалов.',
            path: '/marketing-consent',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
        {
            id: 'offer',
            title: 'Публичная оферта',
            description:
                'Официальное предложение компании заключить договор на указанных условиях.',
            path: '/offer',
            icon: <DocumentTextIcon className="w-6 h-6 text-red-500" />,
        },
    ]

    const [hoveredId, setHoveredId] = useState<string | null>(null)

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Правовая информация
                        </h1>
                        <p className="text-xl text-gray-600">
                            На этой странице собраны все юридические документы
                            компании Asia Motors
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {legalDocuments.map((doc) => (
                            <motion.div
                                key={doc.id}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                onMouseEnter={() => setHoveredId(doc.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-red-50 p-3 flex-shrink-0">
                                        {doc.icon}
                                    </div>
                                    <div className="flex-1">
                                        <Link href={doc.path} className="group">
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-500 transition-colors flex items-center">
                                                {doc.title}
                                                <motion.div
                                                    animate={{
                                                        x:
                                                            hoveredId === doc.id
                                                                ? 5
                                                                : 0,
                                                        opacity:
                                                            hoveredId === doc.id
                                                                ? 1
                                                                : 0,
                                                    }}
                                                    className="ml-2"
                                                >
                                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                                </motion.div>
                                            </h3>
                                        </Link>
                                        <p className="text-gray-600 mt-2">
                                            {doc.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 bg-gradient-to-r from-red-50 to-purple-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-4">
                                Мы заботимся о безопасности ваших данных
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Asia Motors гарантирует соблюдение всех
                                требований законодательства в отношении
                                обработки персональных данных. Мы внедрили
                                множество технических и организационных мер для
                                обеспечения безопасности информации, которой вы
                                делитесь с нами.
                            </p>
                            <p className="text-gray-700">
                                Если у вас возникли вопросы касательно правовых
                                аспектов нашей деятельности, пожалуйста,
                                свяжитесь с нами по электронной почте{' '}
                                <a
                                    href="mailto:asiamotors27@mail.ru"
                                    className="text-red-500 hover:underline"
                                >
                                    asiamotors27@mail.ru
                                </a>
                                .
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-12">
                        <Link
                            href="/"
                            className="group px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-red-600 
                            text-white font-semibold tracking-wider shadow-md hover:shadow-lg transition-all 
                            duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LegalPage
