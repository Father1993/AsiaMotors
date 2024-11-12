import Link from 'next/link'
import Image from 'next/image'
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                {/* Основной контент футера */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Колонка с информацией о компании */}
                    <div className="space-y-4">
                        <Image
                            src="/img/logo.png"
                            alt="Asia Motors - Автомобили из Китая"
                            width={130}
                            height={40}
                            className="mb-4 mx-auto lg:mx-0 margin__center"
                        />
                        <p className="text-sm leading-relaxed text-center lg:text-left">
                            Asia Motors - ваш надежный партнер по покупке и
                            доставке автомобилей из Китая. Представитель ведущих
                            китайских автопроизводителей с 2022 года в РФ.
                        </p>
                        <div className="flex space-x-4 justify-center">
                            {/* Социальные сети */}

                            <a
                                href="https://t.me/asiamotors_su"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Наш Telegram канал"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.05-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.187.943.112.78.89z" />
                                </svg>
                            </a>

                            <a
                                href="https://youtube.com/@AsiaMotors_su"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Наш YouTube канал"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/79294156555"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Написать в WhatsApp"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <a
                                href="https://vk.com/asiamotors"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Мы ВКонтакте"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.713-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.777 0-.255.102-.492.593-.492h1.744c.44 0 .61.186.78.661.848 2.468 2.27 4.634 2.856 4.634.22 0 .322-.102.322-.66V9.793c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.747c.372 0 .509.186.509.627v3.37c0 .373.17.508.271.508.22 0 .407-.135.813-.542 1.27-1.439 2.19-3.658 2.19-3.658.119-.254.373-.491.745-.491h1.744c.525 0 .644.27.525.643-.22 1.032-2.374 4.092-2.374 4.092-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.05.17.475-.085.713-.576.713z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Колонка с услугами */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4 text-center lg:text-left">
                            Услуги
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/services/new-cars"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Новые автомобили из Китая
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services/used-cars"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Подержанные авто из Китая
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services/delivery"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Доставка автомобилей
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services/customs"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Таможенное оформление
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services/insurance"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Страхование автомобилей
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Колонка с информацией */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4 text-center lg:text-left">
                            Информация
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    О компании
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Блог об автомобилях
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/reviews"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Отзывы клиентов
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Частые вопросы
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contacts"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Контакты
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Колонка с контактами */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4 text-center lg:text-left">
                            Контакты
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <PhoneIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">
                                        Телефон:
                                    </p>
                                    <a
                                        href="tel:+74212935555"
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        +7 (4212) 93-55-55
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <EnvelopeIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">
                                        Email:
                                    </p>
                                    <a
                                        href="mailto:asiamotors27@mail.ru"
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        asiamotors27@mail.ru
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPinIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-white">
                                        Адрес:
                                    </p>
                                    <p>
                                        г. Хабаровск, ул. Зеленая 3-А, офис 215
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="text-sm">
                            © 2024 Asia Motors. Все права защищены.
                            <Link
                                href="/privacy-policy"
                                className="hover:text-red-500 transition-colors ml-2"
                            >
                                Политика конфиденциальности
                            </Link>
                        </div>
                        <div className="text-sm md:text-right">
                            <p>
                                Дилер китайских автомобилей в России. Работаем с
                                2022 года.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
