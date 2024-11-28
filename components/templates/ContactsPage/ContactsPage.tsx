/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
} from '@heroicons/react/24/outline'
import { FaTelegramPlane, FaWhatsapp, FaVk } from 'react-icons/fa'
import {
    telegramAsiaLink,
    whatsAppAsiaLink,
} from '@/shared/constants/socialLinks'
import ContactForm from '@/components/templates/AboutPage/ContactsBlock'
import { offices } from '@/shared/constants/offices'
import { Office, OfficeKey } from '@/shared/types/offices'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { CONTACTS } from '@/shared/constants/breadcrumbs'
import KhvMap from '@/components/common/Maps/KhvMap'
import VdkMap from '@/components/common/Maps/VdkMap'
import SahalinMap from '@/components/common/Maps/SahalinMap'
import KamchatkaMap from '@/components/common/Maps/KamchatkaMap'
import SuifenheMap from '@/components/common/Maps/SuifenheMap'
import HarbinMap from '@/components/common/Maps/HarbinMap'

const ContactsPage = () => {
    const MapComponents = {
        khv: KhvMap,
        vdk: VdkMap,
        harbin: HarbinMap,
        shl: SahalinMap,
        kmch: KamchatkaMap,
        suifenhe: SuifenheMap,
    }

    const [selectedOffice, setSelectedOffice] =
        useState<OfficeKey>('khabarovsk')
    const currentOffice = offices[selectedOffice]

    // Получаем компонент карты на основе текущего офиса
    const CurrentMap = MapComponents[currentOffice.mapComponent]

    return (
        <>
            <section className="relative overflow-hidden">
                {/* Фоновый градиент */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

                <div className="container relative z-10 custom__margin">
                    <Breadcrumbs items={CONTACTS} />
                    {/* SEO-оптимизированный заголовок */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 mb-6">
                            <span className="text-[#2F3136]">Наши офисы</span>{' '}
                            Asia Motors
                        </h1>
                        <p className="text-xl text-gray-600 max-w-5xl mx-auto">
                            Посетите наши представительства в <u>России</u> и{' '}
                            <u>Китае</u>: Хабаровск, Владивосток,
                            Южно-Сахалинск, Петропавловск-Камчатский, Харбин,
                            Суйфэньхэ. Откройте для себя преимущества
                            международного сотрудничества и профессиональный
                            подход к подбору автомобиля вашей мечты.
                        </p>
                    </div>

                    {/* Переключатель офисов */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12 px-4">
                        {(Object.entries(offices) as [OfficeKey, Office][]).map(
                            ([key, office]) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedOffice(key)}
                                    className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base w-full sm:w-auto
                                    ${
                                        selectedOffice === key
                                            ? 'bg-[#2F3136] text-white shadow-lg shadow-red-600/20'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    {office.city}
                                </motion.button>
                            )
                        )}
                    </div>

                    {/* Карточка офиса */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedOffice}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid lg:grid-cols-2 gap-12"
                        >
                            {/* Информация об офисе */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <div className="relative h-64 mb-8 rounded-2xl overflow-hidden">
                                    <Image
                                        src={currentOffice.image}
                                        alt={`Офис Asia Motors в городе ${currentOffice.city}`}
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority={true}
                                        quality={75}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <h2 className="text-2xl font-bold">
                                            Офис в г. {currentOffice.city}
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPinIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Адрес:
                                            </h3>
                                            <p className="text-gray-600">
                                                {currentOffice.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <PhoneIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Телефон:
                                            </h3>
                                            <a
                                                href={`tel:${currentOffice.phone}`}
                                                className="text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                {currentOffice.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <EnvelopeIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Email:
                                            </h3>
                                            <a
                                                href={`mailto:${currentOffice.email}`}
                                                className="text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                {currentOffice.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <ClockIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Режим работы:
                                            </h3>
                                            <p className="text-gray-600">
                                                {currentOffice.workHours}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Социальные сети */}
                                    <div className="pt-6 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-4">
                                            Связаться с нами:
                                        </h3>
                                        <div className="flex gap-4">
                                            <motion.a
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                href={whatsAppAsiaLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                                            >
                                                <FaWhatsapp className="w-6 h-6" />
                                            </motion.a>
                                            <motion.a
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                href={telegramAsiaLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                            >
                                                <FaTelegramPlane className="w-6 h-6" />
                                            </motion.a>
                                            <motion.a
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                href="https://vk.com/asiamotors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors"
                                            >
                                                <FaVk className="w-6 h-6" />
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Карта */}
                            <motion.div
                                key={selectedOffice}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="h-full min-h-[600px] rounded-3xl overflow-hidden shadow-xl"
                            >
                                <CurrentMap />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                {/* Форма обратной связи */}
                <ContactForm />
            </section>
        </>
    )
}

export default ContactsPage
