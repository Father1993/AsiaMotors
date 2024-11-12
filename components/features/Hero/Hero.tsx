'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/common/Button/Button'

const Hero: React.FC = () => {
    const count = useMotionValue(0)
    const rounded = useTransform(count, Math.round)

    useEffect(() => {
        const animation = animate(count, 270, {
            duration: 2,
            ease: 'easeOut',
        })

        return animation.stop
    }, [])

    return (
        <section className="relative min-h-screen bg-white">
            <div className="container mx-auto px-4">
                <div className="flex min-h-screen">
                    {/* Левая часть с текстом */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0 relative z-10">
                        <div className="max-w-xl">
                            <div className="inline-block mb-6">
                                <span className="px-3 py-1 text-sm font-semibold text-red-600 bg-blue-50 rounded-full">
                                    Надежная доставка авто
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 font-">
                                <span className="text-red-600 block">
                                    Авто из Китая
                                </span>
                                <span className="block">в любой город РФ</span>
                            </h1>

                            <h2 className="text-xl md:text-2xl text-gray-600 lg:text-gray-600 text-black mb-8 ">
                                С гарантированной доставкой– доверяйте
                                профессионалам из AsiaMotors!
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-black rounded-xl shadow-lg hover:shadow-blue-200 transition duration-300 font-inter"
                                >
                                    Оставить заявку
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="px-8 py-4 bg-gray-50 hover:bg-gray-100 text-black-800 rounded-xl transition duration-300"
                                >
                                    Узнать стоимость
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-8 max-w-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-black-900">
                                            <motion.span>{rounded}</motion.span>
                                            +
                                        </div>
                                        <div className="text-black-600">
                                            Довольных клиентов
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-black-900">
                                            100%
                                        </div>
                                        <div className="text-black-600">
                                            Гарантия на всех этапах
                                        </div>
                                    </div>
                                </div>

                                {/* Новый блок - Офисы */}
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-black-900 leading-tight">
                                            Официальные представители
                                        </div>
                                        <div className="text-sm text-black-600">
                                            Офисы в Китае и в РФ
                                        </div>
                                    </div>
                                </div>

                                {/* Новый блок - Прозрачные условия */}
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-black-900 leading-tight">
                                            Прозрачные условия
                                        </div>
                                        <div className="text-sm text-black-600">
                                            Без скрытых комиссий
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть с изображением */}
                    <motion.div
                        className="hidden lg:block w-1/2 relative"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                            delay: 0.2,
                        }}
                    >
                        <motion.div
                            className="absolute inset-0"
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{
                                duration: 1.2,
                                ease: 'easeOut',
                            }}
                        >
                            <div className="absolute -left-24 inset-y-0 w-[150%] h-full">
                                <Image
                                    src="/img/bg.jpeg"
                                    alt="Премиальный автомобиль из Китая"
                                    fill
                                    className="object-cover object-[30%_center] rounded-l-[3rem]"
                                    priority
                                    quality={90}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Мобильная версия изображения */}
            <motion.div
                className="lg:hidden absolute inset-0"
                initial={{
                    opacity: 0,
                    scale: 1,
                    filter: 'brightness(150%) blur(10px)',
                }}
                animate={{
                    opacity: 0.5,
                    scale: 1,
                    filter: 'brightness(100%) blur(0px)',
                }}
                transition={{
                    duration: 1,
                    ease: 'easeOut',
                }}
            >
                <Image
                    src="/img/bg.jpeg"
                    alt="Премиальный автомобиль из Китая"
                    fill
                    className="object-cover object-[23%_center]"
                    priority
                    quality={90}
                />
            </motion.div>
        </section>
    )
}

export default Hero
