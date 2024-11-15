'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Navigation } from 'swiper/modules'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { CARS_DATA } from '@/shared/constants/cars'
import 'swiper/css'
import 'swiper/css/navigation'
import { motion } from 'framer-motion'

const Slider = () => {
    const swiperRef = useRef(null)

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Популярные модели
                    </h2>
                    <p className="text-xl text-gray-600">
                        Откройте для себя лучшие автомобили из Китая
                    </p>
                </div>

                <div className="relative">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        spaceBetween={30}
                        slidesPerView={3}
                        navigation={{
                            prevEl: '.swiper-button-prev',
                            nextEl: '.swiper-button-next',
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {CARS_DATA.map((car) => (
                            <SwiperSlide key={car.name}>
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
                                    <div className="relative h-64">
                                        <Image
                                            src={car.image}
                                            alt={car.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            quality={75}
                                            loading="lazy"
                                        />
                                    </div>
                                    {car.bestseller && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <motion.span
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeOut',
                                                }}
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-xs font-bold text-white px-2 py-1 rounded-full shadow-lg shadow-green-600/30 animate-pulse inline-block"
                                            >
                                                Выгодно!
                                            </motion.span>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {car.name}
                                        </h3>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xl font-semibold text-red-600">
                                                {car.price}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                В наличии
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                            <div className="text-center">
                                                <span className="block text-sm text-gray-500">
                                                    Год
                                                </span>
                                                <span className="font-medium">
                                                    {car.specs.year}
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-sm text-gray-500">
                                                    Двигатель
                                                </span>
                                                <span className="font-medium">
                                                    {car.specs.engine}
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-sm text-gray-500">
                                                    Мощность
                                                </span>
                                                <span className="font-medium">
                                                    {car.specs.power}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10  backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all z-10">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10  backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center  transition-all z-10">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Slider
