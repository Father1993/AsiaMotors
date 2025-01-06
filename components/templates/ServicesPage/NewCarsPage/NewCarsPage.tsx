'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { NEW_CARS } from '@/shared/constants/breadcrumbs'
import { useModalStore } from '@/components/provider/ModalProvider'
import {
    newCarsBenefits,
    newPopularBrands,
} from '@/shared/constants/newCarsPage'

const NewCarsPage = () => {
    const openPopup = useModalStore((state) => state.openPopup)

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <section className="container mx-auto px-4">
                <Breadcrumbs items={NEW_CARS} />

                {/* Hero Section */}
                <div className="relative h-[600px] rounded-2xl overflow-hidden mb-16 ">
                    <Image
                        src="/img/new-cars-bg.webp"
                        alt="Подержанные автомобили из Китая"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white p-8 max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Новые автомобили из Китая
                            </h1>
                            <p className="text-xl mb-8">
                                Откройте для себя будущее автомобильной
                                индустрии с Asia Motors. Инновационные
                                технологии, превосходное качество, доступные
                                цены.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="py-20">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Почему выбирают нас
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {newCarsBenefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <benefit.icon size={48} className="mb-4" />

                                <h3 className="text-xl font-semibold mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Brands Section */}
                <div className="py-16 bg-white rounded-2xl shadow-sm">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Популярные бренды
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {newPopularBrands.map((brand, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="w-32 h-32 flex items-center justify-center"
                            >
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Готовы сделать первый шаг?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Наши специалисты помогут подобрать идеальный автомобиль
                        под ваши потребности и бюджет
                    </p>
                    <button
                        onClick={openPopup}
                        className="bg-[#2F3136] hover:bg-[#848482] text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105 inline-block"
                    >
                        Перезвоните мне!
                    </button>
                </div>
            </section>
        </div>
    )
}

export default NewCarsPage
