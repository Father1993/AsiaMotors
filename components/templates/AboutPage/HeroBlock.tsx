import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const HeroBlock = () => {
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
                <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-200 transition-all duration-300"
                                >
                                    Получить консультацию
                                    <span className="text-xl">→</span>
                                </Link>
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

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/img/office.jpeg"
                                alt="Команда Asia Motors в офисе в Китае"
                                fill
                                className="object-cover"
                                priority={true}
                                quality={75}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <p className="text-sm font-medium">
                                    Наш офис в г.Харбин, Китай
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default HeroBlock
