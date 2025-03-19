'use client'

import Link from 'next/link'
import ArrowLeft from '@/components/ui/ArrowLeft'

const MetricsConsentPage = () => (
    <section className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
            <div className="px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Согласие на обработку данных метрическими программами
                </h1>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <div className="space-y-6">
                        <p>
                            Настоящим я, как пользователь сайта asiamotors.su,
                            даю свое согласие ООО &quot;Азия Моторс&quot; (далее
                            — «Компания») на обработку моих данных с помощью
                            метрических программ при посещении сайта
                            asiamotors.su и его поддоменов.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            1. Перечень используемых метрических программ
                        </h2>
                        <p>
                            Для анализа использования сайта и улучшения
                            пользовательского опыта Компания применяет следующие
                            метрические системы:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Яндекс.Метрика (счетчик 99121605)</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            2. Какие данные собираются
                        </h2>
                        <p>
                            Метрические программы могут собирать следующие
                            данные:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                IP-адрес и информация о браузере пользователя
                            </li>
                            <li>
                                Данные о посещаемых страницах, времени визита и
                                действиях на сайте
                            </li>
                            <li>Источник перехода на сайт</li>
                            <li>
                                Характеристики устройства и операционной системы
                            </li>
                            <li>
                                Географическое положение (на уровне страны и
                                города)
                            </li>
                            <li>
                                Статистика взаимодействия с элементами сайта
                                (клики, прокрутки, заполнение форм)
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            3. Цели сбора данных
                        </h2>
                        <p>Данные собираются в следующих целях:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Анализ поведения пользователей для улучшения
                                сайта и его функций
                            </li>
                            <li>Оценка эффективности рекламных кампаний</li>
                            <li>Выявление и устранение технических проблем</li>
                            <li>
                                Формирование статистических отчетов об
                                использовании сайта
                            </li>
                            <li>Персонализация предложений и контента</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            4. Срок действия согласия и порядок его отзыва
                        </h2>
                        <p>
                            Настоящее согласие действует с момента начала
                            использования сайта и до момента его отзыва. Вы
                            можете отозвать свое согласие на обработку данных
                            метрическими программами следующими способами:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Настроив блокировку соответствующих скриптов в
                                вашем браузере
                            </li>
                            <li>
                                Воспользовавшись инструментами отказа от сбора
                                данных, предоставляемыми метрическими сервисами:{' '}
                                <a
                                    href="https://yandex.ru/support/metrica/general/opt-out.html"
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Яндекс.Метрика
                                </a>
                            </li>
                            <li>
                                Направив письменный запрос на email:
                                asiamotors27@mail.ru
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            5. Дополнительные условия
                        </h2>
                        <p>
                            Компания гарантирует, что все собранные данные будут
                            использоваться исключительно в указанных выше целях
                            и не будут переданы третьим лицам, за исключением
                            случаев, предусмотренных законодательством РФ.
                        </p>
                        <p>
                            Использование метрических программ осуществляется в
                            соответствии с требованиями Федерального закона от
                            27.07.2006 N 152-ФЗ &quot;О персональных
                            данных&quot;.
                        </p>

                        <p className="mt-8">
                            Продолжая использовать сайт asiamotors.su, вы
                            подтверждаете, что прочитали настоящее согласие и
                            принимаете его условия.
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

export default MetricsConsentPage
