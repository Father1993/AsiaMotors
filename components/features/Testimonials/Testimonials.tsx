'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { TESTIMONIALS } from '@/shared/constants/testimonials'

const Testimonials = () => {
    const [, setHoveredId] = useState<number | null>(null)

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            onHoverStart={() => setHoveredId(testimonial.id)}
                            onHoverEnd={() => setHoveredId(null)}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {testimonial.position}
                                    </p>
                                </div>
                                <ChatBubbleLeftRightIcon className="w-8 h-8 text-red-500/20 ml-auto" />
                            </div>

                            <div className="flex mb-4">
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`w-5 h-5 ${
                                            index < testimonial.rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-4 min-h-[100px]">
                                {testimonial.text}
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500">
                                    {testimonial.date}
                                </span>
                                <span className="text-sm font-medium text-red-600">
                                    {testimonial.carModel}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                        Смотреть все отзывы
                    </button>
                </motion.div> */}
            </div>
        </section>
    )
}

export default Testimonials
