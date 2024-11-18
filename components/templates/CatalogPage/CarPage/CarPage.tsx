'use client'

import { Car } from '@/shared/types/catalog'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiArrowLeft, FiHeart, FiShare2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

interface CarPageProps {
    car: Car
}

const CarPage = ({ car }: CarPageProps) => {
    const router = useRouter()

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Кнопка назад */}
            <motion.button
                whileHover={{ x: -5 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
            >
                <FiArrowLeft />
                Назад в каталог
            </motion.button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Изображение */}
                <div className="relative h-[400px] rounded-3xl overflow-hidden">
                    <Image
                        src={car.image}
                        alt={`${car.brand} ${car.name}`}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Информация */}
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {car.brand} {car.name}
                            </h1>
                            <p className="text-xl text-gray-600">
                                {car.category}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <FiHeart className="w-6 h-6" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <FiShare2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Цена */}
                    <div>
                        <h2 className="text-2xl font-bold">{car.price}</h2>
                        {car.oldPrice && (
                            <span className="text-gray-500 line-through">
                                {car.oldPrice}
                            </span>
                        )}
                    </div>

                    {/* Характеристики */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">
                            Характеристики
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {car.specs.map((spec, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    {spec.icon}
                                    <span>{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Кнопка заказа */}
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                        Оставить заявку
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CarPage
