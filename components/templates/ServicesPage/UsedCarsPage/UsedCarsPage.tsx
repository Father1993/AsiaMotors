'use client'

import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { USED_CARS } from '@/shared/constants/breadcrumbs'

const UsedCarsPage = () => {
    const benefits = [
        {
            title: 'Экономия до 30%',
            description:
                'По сравнению с аналогичными моделями на российском рынке',
            icon: '💰',
        },
        {
            title: 'Гарантия качества',
            description: 'Полная проверка автомобиля перед покупкой',
            icon: '✓',
        },
        {
            title: 'Быстрая доставка',
            description: 'От 20 дней с момента покупки до получения',
            icon: '🚚',
        },
        {
            title: 'Полное сопровождение',
            description: 'Помощь в подборе и оформлении документов',
            icon: '📋',
        },
    ]

    const popularCars = [
        {
            name: 'Changan CS35 Plus',
            year: '2022',
            price: 'от 1 100 000 ₽',
            image: '/img/cars/CS35.webp',
        },
        {
            name: 'Haval Jolion',
            year: '2022',
            price: 'от 1 500 000 ₽',
            image: '/img/cars/haval-chulian.jpg',
        },
        {
            name: 'Geely Coolray',
            year: '2022',
            price: 'от 1 300 000 ₽',
            image: '/img/cars/geely_coolray_new.jpg',
        },
    ]

    return (
        <section className="container mx-auto px-4 py-4">
            <Breadcrumbs items={USED_CARS} />

            {/* Hero Section */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden mb-16 ">
                <Image
                    src="/img/used-bg-2.jpg"
                    alt="Подержанные автомобили из Китая"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white p-8 max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Подержанные автомобили из Китая
                        </h1>
                        <p className="text-xl mb-8">
                            Проверенные временем модели по выгодным ценам с
                            гарантией качества
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Нас выбирают- потому что
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="text-4xl mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Cars Section */}
            <div id="catalog" className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Популярные модели
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularCars.map((car, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={car.image}
                                    alt={car.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {car.name}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    Год выпуска: {car.year}
                                </p>
                                <p className="text-2xl font-bold text-[#2F3136]">
                                    {car.price}
                                </p>
                                {/* <button className="w-full mt-4 bg-[#2F3136] hover:bg-[#848482] text-white font-medium py-2 rounded-lg transition-colors">
                                    Узнать подробнее
                                </button> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#2F3136] text-white rounded-2xl p-8 md:p-12 mb-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Готовы приобрести автомобиль мечты?
                    </h2>
                    <p className="text-lg mb-8">
                        Оставьте заявку прямо сейчас и получите персональную
                        консультацию по подбору автомобиля
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-white text-[#2F3136] hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
                    >
                        Оставить заявку
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default UsedCarsPage
