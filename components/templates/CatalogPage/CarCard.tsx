'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiHeart, FiShare2, FiInfo } from 'react-icons/fi'
import { useRef, useState, useEffect } from 'react'
import { CarCardProps } from '@/shared/types/catalog'
import {
    TelegramShareButton,
    WhatsappShareButton,
    VKShareButton,
    TelegramIcon,
    WhatsappIcon,
    VKIcon,
} from 'react-share'

const CarCard = ({ car, viewMode }: CarCardProps) => {
    const [isLiked, setIsLiked] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    // Функция для копирования ссылки
    const copyToClipboard = async () => {
        const url = `https://asiamotors.su/catalog/${car.id}`
        try {
            await navigator.clipboard.writeText(url)
            setIsCopied(true)
            // Сбрасываем состояние через 2 секунды
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    // Анимация для карточки
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    const shareModalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                shareModalRef.current &&
                !shareModalRef.current.contains(event.target as Node)
            ) {
                setIsShareModalOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const gridCard = (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        >
            {/* Секция с изображением */}
            <div className="relative aspect-[16/9] group">
                <Image
                    src={car.image}
                    alt={`${car.brand} ${car.name}`}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Бейджи */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {car.isNew && (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                            Новинка
                        </span>
                    )}
                    {car.discount && (
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                            -{car.discount}%
                        </span>
                    )}
                </div>

                {/* Кнопки действий */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* TODO в будущем можем сохранить понравившейся авто в localStorage */}
                    {/* <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-2 rounded-full ${
                            isLiked
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-700'
                        }`}
                    >
                        <FiHeart className={isLiked ? 'fill-current' : ''} />
                    </motion.button> */}
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsShareModalOpen(!isShareModalOpen)}
                        className="p-2 rounded-full bg-white text-gray-700 relative cursor-pointer"
                    >
                        <FiShare2 />

                        {/* Модальное окно шеринга */}
                        {isShareModalOpen && (
                            <div className="absolute right-0 top-12 bg-white p-4 rounded-xl shadow-lg z-50 flex gap-2">
                                <WhatsappShareButton
                                    url={`https://asiamotors.su/catalog/${car.id}`}
                                    title={`${car.brand} ${car.name} - ${car.price}`}
                                >
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>

                                <TelegramShareButton
                                    url={`https://asiamotors.su/catalog/${car.id}`}
                                    title={`${car.brand} ${car.name} - ${car.price}`}
                                >
                                    <TelegramIcon size={32} round />
                                </TelegramShareButton>

                                <VKShareButton
                                    url={`https://asiamotors.su/catalog/${car.id}`}
                                    title={`${car.brand} ${car.name} - ${car.price}`}
                                    image={car.image}
                                >
                                    <VKIcon size={32} round />
                                </VKShareButton>

                                {/* Кнопка копирования ссылки */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation() // Предотвращаем закрытие модального окна
                                            copyToClipboard()
                                        }}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                        title="Копировать ссылку"
                                    >
                                        {isCopied ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-green-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Всплывающее уведомление */}
                                    {isCopied && (
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                                            Ссылка скопирована!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Информация об автомобиле */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {car.brand} {car.name}
                        </h3>
                        <p className="text-sm text-gray-500">{car.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-red-500">
                            {car.price}
                        </p>
                        {car.oldPrice && (
                            <p className="text-sm text-gray-400 line-through">
                                {car.oldPrice}
                            </p>
                        )}
                    </div>
                </div>

                {/* Характеристики */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {car.specs.map((spec, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-500">{spec.icon}</span>
                            <span className="text-sm">{spec.value}</span>
                        </div>
                    ))}
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <button className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors">
                        Заказать
                    </button>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <FiInfo />
                    </button>
                </div>
            </div>
        </motion.div>
    )

    const listCard = (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex"
        >
            {/* Изображение */}
            <div className="relative w-1/3 group">
                <Image
                    src={car.image}
                    alt={`${car.brand} ${car.name}`}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Информация */}
            <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {car.brand} {car.name}
                        </h3>
                        <div className="flex gap-2 mb-4">
                            {car.isNew && (
                                <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                                    Новинка
                                </span>
                            )}
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                {car.category}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-red-500">
                            {car.price}
                        </p>
                        {car.oldPrice && (
                            <p className="text-sm text-gray-400 line-through">
                                {car.oldPrice}
                            </p>
                        )}
                    </div>
                </div>

                {/* Характеристики в строку */}
                <div className="flex gap-6 mb-6">
                    {car.specs.map((spec, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-gray-500">{spec.icon}</span>
                            <span className="text-sm">{spec.value}</span>
                        </div>
                    ))}
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <button className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors">
                        Заказать
                    </button>
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`px-4 py-3 rounded-xl border ${
                            isLiked
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                    >
                        <FiHeart className={isLiked ? 'fill-current' : ''} />
                    </button>
                    <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <FiShare2 />
                    </button>
                </div>
            </div>
        </motion.div>
    )

    return viewMode === 'grid' ? gridCard : listCard
}

export default CarCard
