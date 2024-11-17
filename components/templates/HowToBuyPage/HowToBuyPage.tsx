import Image from 'next/image'
import Link from 'next/link'
import { STEPS } from '@/shared/constants/steps'

const HowToBuyPage = () => {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50">
            {/* Hero секция */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                        Полное руководство по покупке автомобиля с компанией
                        Asia Motors
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        Мы упростили процесс международной покупки автомобиля,
                        сделав его максимально прозрачным, безопасным и выгодным
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/catalog"
                            className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                            Смотреть каталог
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        >
                            Получить консультацию
                        </Link>
                    </div>
                </div>

                {/* Преимущества */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-8 text-gray-800">
                            Почему выбирают нас?
                        </h2>
                        <ul className="space-y-6 text-gray-700">
                            <li className="flex items-start gap-4">
                                <svg
                                    className="w-6 h-6 text-red-500 mt-1 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Гарантированное качество автомобилей
                                    </h3>
                                    <p className="text-gray-600">
                                        Каждый автомобиль проходит тщательную
                                        проверку по 100+ параметрам перед
                                        отправкой
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <svg
                                    className="w-6 h-6 text-red-500 mt-1 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Прозрачное ценообразование
                                    </h3>
                                    <p className="text-gray-600">
                                        Фиксированная комиссия и подробная
                                        калькуляция всех расходов до начала
                                        сделки
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <svg
                                    className="w-6 h-6 text-red-500 mt-1 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Полное юридическое сопровождение
                                    </h3>
                                    <p className="text-gray-600">
                                        Берем на себя все вопросы с документами,
                                        таможней и сертификацией
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/img/how-buy/import.jpg"
                            alt="Импорт автомобилей из Китая"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Этапы покупки */}
                <div className="bg-white rounded-3xl shadow-xl p-12 mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Этапы покупки автомобиля
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="flex items-center mb-6">
                                    <div
                                        className="w-14 h-14 bg-gradient-to-br from-red-400 via-red-500 to-red-600 
                                    text-white rounded-[1.2rem] flex items-center justify-center text-xl font-bold mr-4
                                    shadow-lg shadow-red-500/30 border border-red-400/20 backdrop-blur-sm
                                    transform hover:scale-105 transition-all duration-300"
                                    >
                                        {step.id}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Гарантии */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-400 text-white rounded-3xl p-12 mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Наши гарантии
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-12 h-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Гарантия качества
                            </h3>
                            <p className="text-black">
                                Предпродажная проверка каждого автомобиля по
                                100+ параметрам.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-12 h-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Прозрачные условия
                            </h3>
                            <p className="text-black">
                                Фиксированная цена в договоре и отсутствие
                                скрытых платежей на всех этапах сделки
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-12 h-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Юридическая чистота
                            </h3>
                            <p className="text-black">
                                Гарантируем легальность всех документов и
                                чистоту сделки
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-12 h-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Персональный менеджер
                            </h3>
                            <p className="text-black">
                                Ваш персональный менеджер на связи 24/7 на всех
                                этапах сделки
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pb-16">
                    <Link
                        href="/contact"
                        className="inline-block px-12 p-8 bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg mt-12"
                    >
                        Хочу купить автомобиль
                    </Link>
                    <p className="mt-4 text-gray-500 pb-10">
                        *Бесплатная консультация и расчет стоимости
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HowToBuyPage
