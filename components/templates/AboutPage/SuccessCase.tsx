import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { successCases } from '@/shared/constants/cases'
import { FaTelegramPlane } from 'react-icons/fa'

const SuccessCase = () => {
    // Секция с кейсами
    return (
        <section className="bg-gray-50 py-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Кейсы клиентов
            </h2>
            <div className="grid md:grid-cols-2 gap-8 container mx-auto px-4">
                {successCases.map((cases, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-3xl shadow-lg overflow-hidden"
                    >
                        <Image
                            src={cases.image}
                            alt={cases.title}
                            width={600}
                            height={400}
                            className="w-full h-64 object-cover"
                            quality={65}
                            loading="lazy"
                        />
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-4">
                                {cases.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {cases.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-green-600 font-bold">
                                    +Экономия: {cases.savings}
                                </span>
                                <Link
                                    href={cases.link}
                                    className="text-gray-400 hover:underline flex items-center gap-2"
                                >
                                    Подробнее в{' '}
                                    <FaTelegramPlane className="text-blue-500" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default SuccessCase
