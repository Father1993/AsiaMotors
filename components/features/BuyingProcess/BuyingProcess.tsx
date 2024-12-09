'use client'

import { motion } from 'framer-motion'
import { STEPS } from '@/shared/constants/steps'

const BuyingProcess = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Как купить автомобиль
                    </h2>
                    <p className="text-lg text-gray-600">
                        Простой и прозрачный процесс покупки автомобиля из Китая
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative max-w-5xl mx-auto">
                    {/* Линии соединения */}
                    <div className="absolute top-[15%] left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 transform -translate-y-1/2 z-0" />
                    <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 transform -translate-y-1/2 z-0" />
                    <div className="absolute top-[85%] left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 transform -translate-y-1/2 z-0" />

                    {STEPS.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative group z-10"
                        >
                            <div className="absolute -top-3 left-6 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white">
                                {step.id}
                            </div>

                            <div className="flex items-start gap-4">
                                <motion.div
                                    className="mt-4 text-red-600"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <step.icon className="w-8 h-8" />
                                </motion.div>

                                <div className="flex-1 mt-2">
                                    <motion.h3
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.2 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="text-lg font-bold mb-2 text-gray-900"
                                    >
                                        {step.title}
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.3 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="text-sm text-gray-600 leading-relaxed"
                                    >
                                        {step.description}
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BuyingProcess
