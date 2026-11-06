import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import PersonalPopup from '@/components/features/PersonalPopup/PersonalPopup'

const HeroBlock = () => {
    const [isQuestionPopupOpen, setIsQuestionPopupOpen] = useState(false)

    const scrollToTeam = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const teamSection = document.querySelector('#team')
        if (teamSection) {
            teamSection.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }
    }

    return (
        <section className="relative mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white -z-10" />

            <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
                <div className="grid gap-8 lg:gap-12 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6">
                            О компании Asia Motors
                        </span>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                            Ваш надёжный партнёр в мире китайских автомобилей
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Мы не просто импортируем автомобили – мы создаём
                            доверительные отношения с каждым клиентом. Наша
                            команда профессионалов с собственными офисами в
                            Китае обеспечивает полный цикл поддержки и
                            гарантирует безопасность вашей сделки.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <button
                                    onClick={() => setIsQuestionPopupOpen(true)}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-200 transition-all duration-300"
                                >
                                    Получить консультацию
                                    <span className="text-xl">→</span>
                                </button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/about#team"
                                    onClick={scrollToTeam}
                                    className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-all duration-300"
                                >
                                    Познакомиться с командой
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    <figure>
                        <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
                            <Image
                                src="/img/about-delivery-map.webp"
                                alt="Карта маршрутов Asia Motors из Китая на Дальний Восток России"
                                width={1672}
                                height={941}
                                sizes="(min-width: 1280px) 680px, (min-width: 1024px) 960px, (min-width: 768px) 704px, calc(100vw - 64px)"
                                className="h-auto w-full"
                                loading="eager"
                                fetchPriority="high"
                                quality={90}
                            />
                        </div>
                        <figcaption className="mt-3 text-right text-sm">
                            <a
                                href="/img/about-delivery-map.webp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-red-700 underline underline-offset-4 hover:text-red-900"
                            >
                                Открыть карту в полном размере
                            </a>
                        </figcaption>
                    </figure>
                </div>
            </div>
            <PersonalPopup
                isOpen={isQuestionPopupOpen}
                onClose={() => setIsQuestionPopupOpen(false)}
            />
        </section>
    )
}

export default HeroBlock
