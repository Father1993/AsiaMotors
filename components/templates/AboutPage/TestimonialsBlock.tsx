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
        text: 'Обратилась в компанию АзияМоторс, чтобы приобрести автомобиль из Китая, и осталась очень довольна. Мне привезли Exeed TX L 2021 года, машина в отличном состоянии, даже лучше, чем на фотографиях...',
        author: 'Ольга. М',
        link: 'https://www.dvhab.ru/asiamotors-hab#comments',
    },
    {
        platform: '2ГИС',
        logo: '/img/testimonials/2gis.jpg',
        rating: 4.7,
        text: 'Грузовик пришел в идеальном состоянии, все документы на месте, доставка была организована вовремя Особенно хочу отметить персональное внимание к нашим запросам. Менеджер всегда были на связи, отвечал на все вопросы, а также предложили выгодные условия по скидкам для корпоративных клиентов...',
        author: 'Perevozka27.ru',
        link: 'https://go.2gis.com/buCc2',
    },
    {
        platform: 'Яндекс',
        logo: '/img/testimonials/yandex.png',
        rating: 4.9,
        text: 'Огромное спасибо Asia Motors! Нашли идеальный автомобиль, который полностью соответствует моим требованиям. Рекомендую всем, кто хочет купить качественное авто.',
        author: 'Дмитрий Р.',
        link: 'https://yandex.ru/maps/org/azia_motors/66335098400/reviews/?ll=135.128430%2C48.449259&utm_source=share&z=17',
    },
]

const TestimonialsBlock = () => {
    return (
        <section className="bg-gray-50 py-16" id="testimonials__section">
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
