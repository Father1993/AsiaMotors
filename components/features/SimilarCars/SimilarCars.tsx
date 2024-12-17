/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { formatPrice, generateCarSlug, specIcons } from '@/shared/utils/catalog'

interface SimilarCarsProps {
    currentCar: any
    allCars: any[]
}

const SimilarCars = ({ currentCar, allCars }: SimilarCarsProps) => {
    const [similarCars, setSimilarCars] = useState<any[]>([])

    useEffect(() => {
        // Находим похожие автомобили по категории, ценовому диапазону и исключаем текущий
        const similar = allCars
            .filter(
                (car) =>
                    car.id !== currentCar.id &&
                    car.category === currentCar.category &&
                    Math.abs(car.price - currentCar.price) <= 500000 // Диапазон ±500k рублей
            )
            .slice(0, 4) // Берем только 4 автомобиля

        setSimilarCars(similar)
    }, [currentCar, allCars])

    if (similarCars.length === 0) return null

    return (
        <section
            className="py-12 bg-gradient-to-b from-gray-50 to-white"
            aria-label="Похожие автомобили"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">Похожие автомобили</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarCars.map((car) => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={`/catalog/${generateCarSlug(car)}`}
                                className="block group"
                            >
                                <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                    {/* Изображение */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={car.images[0]}
                                            alt={`${car.brand} ${car.model} ${car.year}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    </div>

                                    {/* Информация */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">
                                            {car.brand} {car.model} {car.year}
                                        </h3>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                {specIcons.engineVolume}
                                                <span>
                                                    {car.specs.engineVolume}л /{' '}
                                                    {car.specs.fuelType}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {specIcons.mileage}
                                                <span>
                                                    {car.specs.mileage.toLocaleString()}{' '}
                                                    км
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {specIcons.drive}
                                                <span>
                                                    {car.specs.driveType}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-lg text-red-600">
                                                {formatPrice(car.price)}
                                            </span>
                                            <motion.span
                                                className="text-gray-400 group-hover:text-red-600 transition-colors"
                                                whileHover={{ x: 5 }}
                                            >
                                                <FiArrowRight size={20} />
                                            </motion.span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SimilarCars
