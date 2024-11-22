/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { motion } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'

const CompanyCard = () => {
    return (
        <section className="mb-16" id="company-card">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Карточка предприятия
                    </h2>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/documents/AsiaMotors-карточка_предприятия.pdf"
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        <FaDownload className="text-sm" />
                        Скачать PDF
                    </motion.a>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Полное наименование
                            </h3>
                            <p className="text-gray-800">ООО "Азиа Моторс"</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Реквизиты
                            </h3>
                            <p className="text-gray-800">
                                ИНН/КПП: 2700010128/270001001
                            </p>
                            <p className="text-gray-800">ОГРН: 1232700006868</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Юридический адрес
                            </h3>
                            <p className="text-gray-800">
                                680032, г. Хабаровск, ул. Зеленая, д. 3А, офис
                                215
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Банковские реквизиты
                            </h3>
                            <p className="text-gray-800">
                                Дальневосточный банк ПАО Сбербанк
                            </p>
                            <p className="text-gray-800">БИК: 040813608</p>
                            <p className="text-gray-800">
                                Р/с: 40702810570000024981
                            </p>
                            <p className="text-gray-800">
                                К/с: 30101810600000000608
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Контактная информация
                            </h3>
                            <p className="text-gray-800">
                                Тел: +7 (929) 415-65-55
                            </p>
                            <p className="text-gray-800">
                                Email: asiamotors27@mail.ru
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default CompanyCard
