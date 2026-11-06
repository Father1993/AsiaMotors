'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Navigation } from 'swiper/modules'
import Link from 'next/link'
import Image from 'next/image'
import { CarAvailability } from '@/components/common/CarAvailability'
import type { Car } from '@/shared/types/adminTypes'
import { formatPrice, generateCarSlug } from '@/shared/utils/catalog'
import 'swiper/css'
import 'swiper/css/navigation'

export default function Slider({ cars }: { cars: Car[] }) {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" aria-labelledby="popular-cars-heading">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 id="popular-cars-heading" className="text-4xl font-bold text-gray-900 mb-4">
                        Популярные модели
                    </h2>
                    <p className="text-xl text-gray-600">Откройте для себя лучшие автомобили из Китая</p>
                </div>
                <Swiper
                    modules={[Navigation, A11y]}
                    navigation
                    a11y={{ prevSlideMessage: 'Предыдущий автомобиль', nextSlideMessage: 'Следующий автомобиль' }}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2, spaceBetween: 24 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="!pb-4"
                >
                    {cars.map((car) => (
                        <SwiperSlide key={car.id}>
                            <Link
                                href={`/catalog/${generateCarSlug(car)}`}
                                prefetch={false}
                                className="block rounded-2xl shadow-md overflow-hidden bg-white focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-red-600"
                            >
                                <div className="relative aspect-[16/9]">
                                    <Image
                                        src={car.images[0]}
                                        alt={`${car.brand} ${car.model}`}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <CarAvailability value={car.availability} />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h3>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {car.year} г. · {car.specs.fuelType} · {car.specs.horsePower} л.с.
                                    </p>
                                    <p className="text-xl font-semibold text-red-600 mt-3">{formatPrice(car.price)}</p>
                                    <p className="text-sm text-gray-600">Цена под ключ в РФ</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}
