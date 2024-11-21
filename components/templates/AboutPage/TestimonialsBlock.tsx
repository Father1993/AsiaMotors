'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa'

const testimonials = [
    {
        platform: 'DVHUB',
        logo: '/img/testimonials/dvhub.jpeg',
        rating: 4.8,
        text: 'Профессиональная команда, которая полностью взяла на себя все заботы по покупке автомобиля из Китая. Быстро, надежно и без головной боли!',
        author: 'Максим С.',
        link: 'https://dvhub.ru/reviews/asiamotors',
    },
    {
        platform: 'Яндекс',
        logo: '/img/testimonials/yandex.png',
        rating: 4.9,
        text: 'Огромное спасибо Asia Motors! Нашли идеальный автомобиль, который полностью соответствует моим требованиям. Рекомендую всем, кто хочет купить качественное авто.',
        author: 'Елена П.',
        link: 'https://yandex.ru/reviews/asiamotors',
    },
    {
        platform: '2ГИС',
        logo: '/img/testimonials/2gis.jpg',
        rating: 4.7,
        text: 'Единственная компания, которой я полностью доверяю в вопросах импорта автомобилей. Прозрачность, профессионализм и индивидуальный подход.',
        author: 'Дмитрий Р.',
        link: 'https://2gis.ru/reviews/asiamotors',
    },
]

const TestimonialsBlock = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Отзывы наших клиентов
                    </h2>
                    <p className="text-xl text-gray-600">
                        Более 270 довольных клиентов уже приобрели автомобили с
                        нашей помощью
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <Image
                                    src={testimonial.logo}
                                    alt={`${testimonial.platform} лого`}
                                    width={100}
                                    height={40}
                                    className="h-10 w-auto object-contain"
                                    quality={65}
                                    loading="lazy"
                                />
                                <div className="flex items-center text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i <
                                                Math.floor(testimonial.rating)
                                                    ? 'text-yellow-500'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600 text-sm">
                                        {testimonial.rating}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                &quot;{testimonial.text}&quot;
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    {testimonial.author}
                                </span>
                                <Link
                                    href={testimonial.link}
                                    target="_blank"
                                    className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Больше отзывов
                                    <FaExternalLinkAlt className="ml-2 w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialsBlock
