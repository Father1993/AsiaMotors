import Image from 'next/image'
import Link from 'next/link'
import { STEPS } from '@/shared/constants/steps'

const HowToBuyPage = () => {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50 pb-20">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                        Полное руководство по покупке автомобиля из Китая
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Мы упростили процесс международной покупки автомобиля,
                        сделав его максимально прозрачным, безопасным и выгодным
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Почему выбирают нас?
                        </h2>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center gap-3">
                                <svg
                                    className="w-6 h-6 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Гарантированное качество автомобилей
                            </li>
                            <li className="flex items-center gap-3">
                                <svg
                                    className="w-6 h-6 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Прозрачное ценообразование
                            </li>
                            <li className="flex items-center gap-3">
                                <svg
                                    className="w-6 h-6 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Полное юридическое сопровождение
                            </li>
                        </ul>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/img/how-buy/import.jpg"
                            alt="Импорт автомобилей из Китая"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-8 mb-16">
                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
                        Этапы покупки автомобиля
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mr-4">
                                        {step.id}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Начать покупку
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HowToBuyPage
