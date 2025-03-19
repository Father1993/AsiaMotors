'use client'

import Link from 'next/link'
import ArrowLeft from '@/components/ui/ArrowLeft'

const ConsentPage = () => (
    <section className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
            <div className="px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Согласие на обработку персональных данных
                </h1>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <div className="space-y-6">
                        <p>
                            Настоящим я, далее – «Субъект персональных данных»,
                            во исполнение требований Федерального закона от
                            27.07.2006 г. № 152-ФЗ «О персональных данных»
                            свободно, своей волей и в своем интересе даю свое
                            согласие ООО "Азия Моторс" (ИНН/КПП:
                            2700010128/270001001, ОГРН: 1232700006868) на
                            обработку своих персональных данных, указанных при
                            регистрации и/или оставлении заявки на сайте
                            asiamotors.su и его поддоменах (далее – Сайт).
                        </p>

                        <p>
                            Под персональными данными я понимаю любую
                            информацию, относящуюся ко мне как к Субъекту
                            персональных данных, в том числе мои фамилию, имя,
                            отчество, контактные данные (телефон, электронная
                            почта) и иные данные, которые могут быть
                            использованы при заключении договоров с ООО "Азия
                            Моторс".
                        </p>

                        <p>Согласие дается мною для целей:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                обработки заявок на приобретение товаров и
                                услуг;
                            </li>
                            <li>
                                информирования о товарах и услугах Компании;
                            </li>
                            <li>связи со мной в случае необходимости;</li>
                            <li>улучшения качества товаров и услуг;</li>
                            <li>
                                проведения статистических и иных исследований.
                            </li>
                        </ul>

                        <p>
                            Я согласен на обработку моих персональных данных,
                            включая сбор, запись, систематизацию, накопление,
                            хранение, уточнение (обновление, изменение),
                            извлечение, использование, передачу
                            (распространение, предоставление, доступ),
                            обезличивание, блокирование, удаление, уничтожение
                            персональных данных.
                        </p>

                        <p>Я ознакомлен(а), что:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                настоящее согласие действует со дня его
                                подписания до дня отзыва в письменной форме;
                            </li>
                            <li>
                                согласие может быть отозвано мною на основании
                                письменного заявления, направленного в адрес ООО
                                "Азия Моторс" по почте заказным письмом с
                                уведомлением о вручении либо вручено лично под
                                расписку представителю ООО "Азия Моторс";
                            </li>
                            <li>
                                обработка моих персональных данных может
                                осуществляться с использованием средств
                                автоматизации и без использования таких средств;
                            </li>
                            <li>
                                в случае отзыва согласия на обработку
                                персональных данных ООО "Азия Моторс" вправе
                                продолжить обработку персональных данных без
                                моего согласия при наличии оснований, указанных
                                в пунктах 2-11 части 1 статьи 6, части 2 статьи
                                10 и части 2 статьи 11 Федерального закона от
                                27.07.2006 г. № 152-ФЗ «О персональных данных».
                            </li>
                        </ul>

                        <p>
                            Я подтверждаю, что, давая такое согласие, я действую
                            свободно, своей волей и в своем интересе.
                        </p>

                        <p>
                            Данное Согласие признается мной и ООО "Азия Моторс"
                            письменным согласием на обработку моих персональных
                            данных, данным согласно ст. 9 Федерального закона от
                            27.07.2006 г. №152-ФЗ «О персональных данных».
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

export default ConsentPage
