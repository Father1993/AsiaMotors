'use client'

import Link from 'next/link'
import ArrowLeft from '@/components/ui/ArrowLeft'

const MarketingConsentPage = () => (
    <section className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10">
            <div className="px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Согласие на получение рекламной рассылки
                </h1>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <div className="space-y-6">
                        <p>
                            Настоящим я, как пользователь сайта asiamotors.su,
                            даю свое согласие ООО &quot;Азия Моторс&quot;
                            (ИНН/КПП: 2700010128/270001001, ОГРН: 1232700006868)
                            на получение от компании рекламной информации в
                            соответствии с Федеральным законом от 13.03.2006 N
                            38-ФЗ &quot;О рекламе&quot;.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            1. Объем и содержание рассылки
                        </h2>
                        <p>Рекламные материалы могут включать в себя:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Информацию о новых моделях и поступлениях
                                автомобилей
                            </li>
                            <li>
                                Специальные предложения и акции по приобретению
                                автомобилей и запчастей
                            </li>
                            <li>Информацию о скидках и льготных условиях</li>
                            <li>Приглашения на мероприятия и тест-драйвы</li>
                            <li>Новости компании и автомобильного рынка</li>
                            <li>Полезные материалы для автовладельцев</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            2. Способы доставки рекламных материалов
                        </h2>
                        <p>
                            Я соглашаюсь получать рекламные материалы следующими
                            способами:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Электронные сообщения на указанный мной адрес
                                электронной почты
                            </li>
                            <li>
                                SMS и MMS-сообщения на указанный мной номер
                                телефона
                            </li>
                            <li>
                                Сообщения в мессенджерах (WhatsApp, Telegram и
                                др.)
                            </li>
                            <li>
                                Push-уведомления в браузере (при наличии
                                согласия на уровне браузера)
                            </li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            3. Частота рассылки
                        </h2>
                        <p>
                            Рекламная рассылка может осуществляться с
                            периодичностью не чаще 2 раз в неделю, за
                            исключением случаев проведения специальных акций и
                            мероприятий, о которых требуется своевременное
                            информирование.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            4. Срок действия согласия и порядок отзыва
                        </h2>
                        <p>
                            Согласие на получение рекламной рассылки действует
                            бессрочно до момента его отзыва. Я вправе отозвать
                            свое согласие следующими способами:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Пройдя по ссылке отписки, которая присутствует в
                                каждом рекламном сообщении
                            </li>
                            <li>
                                Отправив сообщение с текстом
                                &quot;ОТПИСАТЬСЯ&quot; в ответ на SMS или
                                сообщение в мессенджере
                            </li>
                            <li>
                                Направив письменное заявление на электронную
                                почту asiamotors27@mail.ru
                            </li>
                            <li>
                                Связавшись с компанией по телефону +7 (4212)
                                93-55-55
                            </li>
                        </ul>
                        <p>
                            Отзыв согласия на получение рекламной рассылки
                            обрабатывается в течение 3 рабочих дней с момента
                            получения.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8">
                            5. Дополнительные условия
                        </h2>
                        <p>
                            ООО &quot;Азия Моторс&quot; обязуется не передавать
                            мои контактные данные третьим лицам для
                            осуществления рекламной рассылки.
                        </p>
                        <p>
                            Я подтверждаю, что все указанные мной контактные
                            данные являются верными, принадлежат мне и по ним
                            может быть осуществлена рекламная рассылка.
                        </p>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-8">
                            <p className="font-medium text-yellow-800">
                                Важное примечание: Для получения рекламной
                                рассылки вам необходимо подтвердить свое
                                согласие активным действием – установить галочку
                                в соответствующем поле и/или нажать кнопку
                                подтверждения в форме подписки на рассылку.
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
        </div>
    </section>
)

export default MarketingConsentPage
