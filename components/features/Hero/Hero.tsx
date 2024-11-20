'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import ClientIcon from '@/components/ui/ClientIcon'
import GarantiesIcons from '@/components/ui/GarantiesIcons'
import OfficialIcon from '@/components/ui/OfficialIcon'
import ConditionIcon from '@/components/ui/ConditionIcon'
import { useModalStore } from '@/components/provider/ModalProvider'

const Hero: React.FC = () => {
    const [currentWord, setCurrentWord] = useState(0)
    const words = ['Надежно', 'Выгодно', 'Быстро']
    const colors = ['text-green-500', 'text-blue-500', 'text-red-500']
    const openPopup = useModalStore((state) => state.openPopup)

    const count = useMotionValue(0)
    const rounded = useTransform(count, Math.round)

    useEffect(() => {
        const animation = animate(count, 270, {
            duration: 2,
            ease: 'easeOut',
        })

        const wordInterval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length)
        }, 2000)

        return () => {
            animation.stop()
            clearInterval(wordInterval)
        }
    }, [count, words.length])

    return (
        <section className="relative min-h-screen bg-white pb-10">
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

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                <span className="text-black-600 block font-bold">
                                    Импорт автомобилей из Китая.{' '}
                                    <span className="relative inline-block">
                                        <span
                                            className={`${colors[currentWord]} transition-colors duration-300`}
                                        >
                                            {words[currentWord]}
                                        </span>
                                        <motion.span
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: Infinity,
                                                repeatDelay: 1.5,
                                            }}
                                            className="absolute bottom-0 left-0 h-1 bg-red-500"
                                        />
                                    </span>
                                </span>
                                <span className="block">в любой город РФ</span>
                            </h1>

                            <h2 className="text-xl md:text-2xl text-black lg:text-gray-600 mb-8">
                                Профессиональны с собственными офисами в Китае.
                                Делаем покупку автомобиля простой и безопасной
                            </h2>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <motion.button
                                    onClick={openPopup}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium 
                                    shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.45)] 
                                    transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    Оставить заявку
                                    <motion.span
                                        className="inline-block"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 3 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        →
                                    </motion.span>
                                </motion.button>

                                <motion.button
                                    onClick={openPopup}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-xl font-medium
                                    hover:bg-red-50/50 transition-all duration-300 backdrop-blur-sm
                                    flex items-center justify-center gap-2 group"
                                >
                                    <span className="text-xl">₽</span>
                                    Узнать стоимость
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-8 max-w-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <ClientIcon />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-black-900">
                                            <motion.span className="font-bold">
                                                {rounded}
                                            </motion.span>
                                            +
                                        </div>
                                        <div className="text-black-600 text-m">
                                            Довольных клиентов
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <GarantiesIcons />
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-black-900">
                                            100%
                                        </div>
                                        <div className="text-black-600 text-m">
                                            Гарантия на всех этапах
                                        </div>
                                    </div>
                                </div>

                                {/* Новый блок - Офисы */}
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <OfficialIcon />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-black-900 leading-tight">
                                            Официальные представители
                                        </div>
                                        <div className="text-m text-black-600">
                                            Офисы в Китае и в РФ
                                        </div>
                                    </div>
                                </div>

                                {/* Новый блок - Прозрачные условия */}
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <ConditionIcon />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-black-900 leading-tight">
                                            Прозрачные условия
                                        </div>
                                        <div className="text-m text-black-600">
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
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={75}
                                    priority={true}
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
                    sizes="100vw"
                    className="object-cover object-[23%_center]"
                    priority={true}
                    quality={75}
                />
            </motion.div>
        </section>
    )
}

export default Hero
