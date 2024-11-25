/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline'
import YoutubeIcon from '@/components/ui/YoutubeIcon'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import VkIcon from '@/components/ui/VkIcon'
import TelegramIcon from '@/components/ui/TelegramIcon'
import Logo from '@/components/common/Logo/Logo'
import Creator from './Creator'
import CompanyCard from '@/components/ui/Footer/CompanyCardIcon'
import PrivacyPolicyIcon from '@/components/ui/Footer/PrivacyPolicyIcon'
import ImportIcon from '@/components/ui/Footer/ImportIcon'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 md:pb-2 pb-20">
            <div className="container mx-auto px-4">
                {/* Основной контент футера */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Колонка с информацией о компании */}
                    <div className="space-y-4">
                        <Logo className="justify-center" />
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
                                <TelegramIcon />
                            </a>

                            <a
                                href="https://youtube.com/@AsiaMotors_su"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Наш YouTube канал"
                            >
                                <YoutubeIcon />
                            </a>

                            <a
                                href="https://wa.me/79294156555"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Написать в WhatsApp"
                            >
                                <WhatsAppIcon />
                            </a>
                            <a
                                href="https://vk.com/asiamotors"
                                className="hover:text-red-500 transition-colors"
                                aria-label="Мы ВКонтакте"
                            >
                                <VkIcon />
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
                                    href="/services/customs"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Новые запчасти для любых авто
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
                                    href="/about#testimonials__section"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Отзывы клиентов
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Лента новостей
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
                                    href="/vacancies"
                                    className="hover:text-red-500 transition-colors"
                                >
                                    Вакансии
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
                        {/* Юридическая информация */}
                        <div className="legal-info text-sm space-y-2">
                            <h4 className="text-white font-medium mb-3">
                                Юридическая информация
                            </h4>
                            <div className="flex flex-col space-y-1.5">
                                <p itemProp="legalName">
                                    © 2024 ООО "Азиа моторс"
                                </p>
                                <div className="flex items-center space-x-4">
                                    <p>
                                        ИНН:{' '}
                                        <span itemProp="taxID">2700010128</span>
                                    </p>
                                    <p>
                                        ОГРН:{' '}
                                        <span itemProp="registrationNumber">
                                            1232700006868
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Документы */}
                        <div className="text-sm space-y-2">
                            <h4 className="text-white font-medium mb-3">
                                Документы
                            </h4>
                            <div className="flex flex-col space-y-1.5">
                                <Link
                                    href="/about#company-card"
                                    className="hover:text-red-500 transition-colors flex items-center gap-2 w-fit"
                                >
                                    <CompanyCard />
                                    Карточка предприятия
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="hover:text-red-500 transition-colors flex items-center gap-2 w-fit"
                                >
                                    <PrivacyPolicyIcon />
                                    Политика конфиденциальности
                                </Link>
                            </div>
                        </div>

                        {/* Статус компании */}
                        <div className="text-sm space-y-2">
                            <div className="flex flex-col space-y-3">
                                <hr className="footer__spec-hr" />
                                <div className="flex items-center justify-end gap-2 justify-center md:justify-end">
                                    <ImportIcon />
                                    <span itemProp="description">
                                        Импортер китайских автомобилей в России
                                    </span>
                                </div>
                                <div className="flex items-center justify-center md:justify-end text-gray-400">
                                    <span>Работаем с 2022 года</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Creator />
                </div>
            </div>
        </footer>
    )
}

export default Footer
