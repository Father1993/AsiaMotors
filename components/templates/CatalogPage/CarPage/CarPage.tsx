'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    FiArrowLeft,
    FiHeart,
    FiShare2,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiSettings,
    FiZap,
    FiTruck,
    FiDroplet,
} from 'react-icons/fi'
import { CarPageProps } from '@/shared/types/carPage'

const CarPage = ({ car }: CarPageProps) => {
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
        }).format(price)
    }

    const specIcons = {
        mileage: <FiClock className="w-5 h-5 text-red-500" />,
        engineVolume: <FiSettings className="w-5 h-5 text-red-500" />,
        horsePower: <FiZap className="w-5 h-5 text-red-500" />,
        transmission: <FiTruck className="w-5 h-5 text-red-500" />,
        fuelType: <FiDroplet className="w-5 h-5 text-red-500" />,
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="container mx-auto px-4 py-8">
                {/* Навигация */}
                <nav>
                    <Link href="/">Главная</Link>
                    <span>/</span>
                    <Link href="/catalog">Каталог</Link>
                    <span>/</span>
                    <span>
                        {car.brand} {car.model}
                    </span>
                </nav>

                {/* Основной контент */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <FiArrowLeft />
                        Назад в каталог
                    </motion.button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Галерея */}
                        <div className="space-y-4">
                            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full"
                                        onClick={() =>
                                            setIsImageModalOpen(true)
                                        }
                                    >
                                        <Image
                                            src={car.images[currentImageIndex]}
                                            alt={`${car.brand} ${car.model} ${car.year}`}
                                            fill
                                            className="object-cover cursor-pointer"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {car.images.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() =>
                                                setCurrentImageIndex((prev) =>
                                                    prev === 0
                                                        ? car.images.length - 1
                                                        : prev - 1
                                                )
                                            }
                                            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                                        >
                                            <FiChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentImageIndex((prev) =>
                                                    prev ===
                                                    car.images.length - 1
                                                        ? 0
                                                        : prev + 1
                                                )
                                            }
                                            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                                        >
                                            <FiChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Миниатюры */}
                            {car.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {car.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentImageIndex(index)
                                            }
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 
                                                ${
                                                    currentImageIndex === index
                                                        ? 'ring-2 ring-red-600'
                                                        : ''
                                                }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${car.brand} ${
                                                    car.model
                                                } ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Информация */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {car.brand} {car.model} {car.year}
                                    </h1>
                                    <p className="text-xl text-gray-600 mt-1">
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

                            {/* Цена и статус */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-bold text-red-600">
                                        {formatPrice(car.price)}
                                    </h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${
                                            car.available
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {car.available
                                            ? 'В наличии'
                                            : 'Под заказ'}
                                    </span>
                                </div>
                            </div>

                            {/* Характеристики */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Характеристики
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        {specIcons.mileage}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Пробег
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.mileage.toLocaleString()}{' '}
                                                км
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {specIcons.engineVolume}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Двигатель
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.engineVolume}л
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {specIcons.horsePower}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Мощность
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.horsePower} л.с.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {specIcons.transmission}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                КПП
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.transmission}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors">
                                    Оставить заявку
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно для просмотра изображений */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                        onClick={() => setIsImageModalOpen(false)}
                    >
                        <Image
                            src={car.images[currentImageIndex]}
                            alt={`${car.brand} ${car.model}`}
                            width={1200}
                            height={800}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CarPage
