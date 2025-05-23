'use client'

import Link from 'next/link'
import ArrowLeft from '@/components/ui/ArrowLeft'

/* eslint-disable react/no-unescaped-entities */
const RecommendationsPage = () => (
    <section className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
            <div className="px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Информация об использовании рекомендательных технологий
                </h1>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <div className="space-y-6">
                        <p>
                            Уважаемые пользователи! В соответствии с Федеральным
                            законом от 30.12.2020 N 533-ФЗ "О внесении изменений
                            в Федеральный закон "Об информации, информационных
                            технологиях и о защите информации", ООО &quot;Азия
                            Моторс&quot; предоставляет информацию об
                            использовании рекомендательных технологий на сайте
                            asiamotors.su.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            1. Общие положения
                        </h2>
                        <p>
                            Рекомендательные технологии – это алгоритмы, которые
                            анализируют пользовательское поведение и интересы
                            для предложения наиболее релевантного контента и
                            услуг. Они используются для улучшения
                            пользовательского опыта и персонализации
                            взаимодействия с нашим сайтом.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            2. Используемые рекомендательные технологии
                        </h2>
                        <p>
                            На нашем сайте применяются следующие
                            рекомендательные технологии:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Алгоритмы подбора автомобилей на основе
                                предпочтений пользователя
                            </li>
                            <li>
                                Персонализированные предложения моделей авто,
                                основанные на просмотренных страницах
                            </li>
                            <li>
                                Рекомендации аксессуаров и дополнительных услуг
                                на основе выбранного автомобиля
                            </li>
                            <li>
                                Персонализированный контент в новостной ленте
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            3. Принципы работы рекомендательных технологий
                        </h2>
                        <p>
                            Наши рекомендательные системы работают на основе
                            следующих данных и принципов:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>История ваших просмотров на сайте</li>
                            <li>Ваши запросы в поисковой системе сайта</li>
                            <li>
                                Выбранные вами фильтры при поиске автомобилей
                            </li>
                            <li>Время, проведенное на различных страницах</li>
                            <li>
                                Данные о взаимодействии с элементами страницы
                            </li>
                        </ul>
                        <p>
                            На основе этой информации система формирует
                            персонализированные рекомендации, которые могут
                            наиболее точно соответствовать вашим интересам и
                            потребностям.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            4. Управление рекомендательными технологиями
                        </h2>
                        <p>
                            Вы можете отключить использование рекомендательных
                            технологий следующими способами:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Использовать режим инкогнито (приватный
                                просмотр) в вашем браузере
                            </li>
                            <li>Очистить cookies и историю просмотров</li>
                            <li>
                                Направить запрос на отключение рекомендательных
                                технологий на email: asiamotors27@mail.ru
                            </li>
                        </ul>
                        <p>
                            Обратите внимание, что отключение рекомендательных
                            технологий может повлиять на удобство использования
                            сайта, так как представленная информация будет
                            носить более общий характер.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            5. Защита данных
                        </h2>
                        <p>
                            ООО &quot;Азия Моторс&quot; гарантирует, что все
                            данные, используемые в рекомендательных системах,
                            обрабатываются в соответствии с нашей{' '}
                            <Link
                                href="/privacy"
                                className="text-blue-600 hover:underline"
                            >
                                Политикой конфиденциальности
                            </Link>{' '}
                            и действующим законодательством РФ в области защиты
                            персональных данных.
                        </p>
                        <p>
                            Мы не передаем собранные данные третьим лицам, за
                            исключением случаев, предусмотренных
                            законодательством.
                        </p>

                        <p className="mt-8">
                            По всем вопросам, связанным с использованием
                            рекомендательных технологий на нашем сайте, вы
                            можете обратиться по адресу: asiamotors27@mail.ru
                        </p>
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
        </div>
    </section>
)

export default RecommendationsPage
