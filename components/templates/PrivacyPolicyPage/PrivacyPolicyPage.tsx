'use client'

import Link from 'next/link'
import ArrowLeft from '@/components/ui/ArrowLeft'

const PrivacyPolicyPage = () => (
    <main>
        <section className="container mx-auto">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 mb-10">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Политика использования файлов cookie
                    </h1>

                    <div className="text-gray-700">
                        <p>
                            Сайт Asia Motors использует файлы cookie для
                            улучшения вашего опыта использования. Продолжая
                            пользоваться сайтом, вы соглашаетесь с
                            использованием нами файлов cookie
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            Что такое файлы cookie?
                        </h2>
                        <p>
                            Файлы cookie - это небольшие текстовые файлы,
                            которые сохраняются на вашем устройстве (компьютере,
                            смартфоне или планшете) при посещении веб-сайтов.
                            Они широко используются для обеспечения работы
                            веб-сайтов или повышения эффективности их работы, а
                            также для предоставления информации владельцам
                            веб-сайта.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            Как мы используем файлы cookie?
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Для обеспечения правильной работы сайта</li>
                            <li>Для сохранения ваших предпочтений</li>
                            <li>
                                Для анализа использования сайта и улучшения
                                пользовательского опыта
                            </li>
                            <li>Для персонализации контента и рекламы</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            Управление файлами cookie
                        </h2>
                        <p>
                            Вы можете контролировать и/или удалять файлы cookie
                            по своему усмотрению. Подробнее об этом вы можете
                            узнать на сайте{' '}
                            <a
                                href="https://aboutcookies.org"
                                className="text-blue-600 hover:underline"
                            >
                                aboutcookies.org
                            </a>
                            . Вы можете удалить все файлы cookie, которые уже
                            находятся на вашем устройстве, а также настроить
                            большинство браузеров таким образом, чтобы они не
                            размещали файлы cookie. Однако в этом случае вам,
                            возможно, придется вручную настраивать некоторые
                            параметры при каждом посещении сайта, а некоторые
                            службы и функции могут не работать.
                        </p>
                    </div>
                    {/* Кнопка для возврата на главную, выровненная по центру */}
                    <div className="flex justify-center mt-8">
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
    </main>
)

export default PrivacyPolicyPage
