'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'
import {
    // FiHeart,
    FiShare2,
    FiInfo,
    FiDroplet,
    FiSettings,
    FiZap,
    FiClock,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi'
import {
    TelegramShareButton,
    WhatsappShareButton,
    VKShareButton,
    TelegramIcon,
    WhatsappIcon,
    VKIcon,
} from 'react-share'
import { CarCardProps } from '@/shared/types/catalog'
import { generateCarSlug } from '@/shared/utils/catalog'
import { OrderCarModal } from './OrderCarModal'

export const CarCard = ({ car, viewMode }: CarCardProps) => {
    // const [isLiked, setIsLiked] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const carSlug = generateCarSlug(car)
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [imageLoading, setImageLoading] = useState(false)
    const [currentImage, setCurrentImage] = useState(
        car.images[currentImageIndex]
    )

    const handlePrevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setImageLoading(true)
        const newIndex =
            currentImageIndex === 0
                ? car.images.length - 1
                : currentImageIndex - 1
        setCurrentImageIndex(newIndex)
        setCurrentImage(car.images[newIndex])
    }

    const handleNextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setImageLoading(true)
        const newIndex =
            currentImageIndex === car.images.length - 1
                ? 0
                : currentImageIndex + 1
        setCurrentImageIndex(newIndex)
        setCurrentImage(car.images[newIndex])
    }

    // Конфигурация свайпов
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNextImage(),
        onSwipedRight: () => handlePrevImage(),
        trackMouse: false, // Отключаем на десктопе
        preventScrollOnSwipe: true, // Предотвращаем скролл при свайпе
        swipeDuration: 500, // Максимальная длительность свайпа
        delta: 10, // Минимальное расстояние для определения свайпа
    })

    // Функция для копирования ссылки
    const copyToClipboard = async () => {
        const url = `https://asiamotors.su/catalog/${carSlug}`
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

    const handleCardClick = () => {
        router.push(`/catalog/${carSlug}`)
    }

    const LoadingOverlay = () => (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="relative">
                {/* Внешний круг (тень) */}
                <div className="absolute inset-0 w-8 h-8 border-4 border-white/30 rounded-full animate-pulse" />
                {/* Спиннер */}
                <div className="w-8 h-8 border-3 border-white/80 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    )

    const gridCard = (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            onClick={handleCardClick}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        >
            {/* Секция с изображением */}
            <div
                className="relative aspect-[16/9] group touch-pan-y"
                {...swipeHandlers}
            >
                {/* Текущее изображение */}
                <Image
                    src={currentImage}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className={`
                        object-cover transform 
                        group-hover:scale-105 
                        transition-all duration-500 ease-out
                        ${
                            imageLoading
                                ? 'scale-105 blur-sm'
                                : 'scale-100 blur-0'
                        }
                    `}
                    onLoadingComplete={() => setImageLoading(false)}
                    priority={currentImageIndex === 0}
                />

                {/* Оверлей загрузки */}
                {imageLoading && <LoadingOverlay />}

                {/* Индикатор свайпа на мобильных устройствах */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1 md:hidden">
                    {car.images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                index === currentImageIndex
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>

                {/* Кнопки навигации (видимы только на десктопе) */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                    <button
                        onClick={handlePrevImage}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextImage}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Индикатор количества фотографий (видим только на десктопе) */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                    {currentImageIndex + 1} / {car.images.length}
                </div>

                {/* Бейджи */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {car.discount && (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                            ВЫГОДНО
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
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsShareModalOpen(!isShareModalOpen)
                        }}
                        className="p-2 rounded-full bg-white text-gray-700 relative cursor-pointer"
                    >
                        <FiShare2 />

                        {/* Модальное окно шеринга */}
                        {isShareModalOpen && (
                            <div className="absolute right-0 top-12 bg-white p-4 rounded-xl shadow-lg z-50 flex gap-2">
                                <WhatsappShareButton
                                    url={`https://asiamotors.su/catalog/${carSlug}`}
                                    title={`${car.brand} ${car.brand} - ${car.price}`}
                                >
                                    <WhatsappIcon size={32} round />
                                </WhatsappShareButton>

                                <TelegramShareButton
                                    url={`https://asiamotors.su/catalog/${carSlug}`}
                                    title={`${car.brand} ${car.brand} - ${car.price}`}
                                >
                                    <TelegramIcon size={32} round />
                                </TelegramShareButton>

                                <VKShareButton
                                    url={`https://asiamotors.su/catalog/${carSlug}`}
                                    title={`${car.brand} ${car.brand} - ${car.price}`}
                                    image={car.images[0]}
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
                            {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-gray-500">{car.year} г.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-red-500">
                            {new Intl.NumberFormat('ru-RU').format(car.price)} ₽
                        </p>
                        {car.discount && (
                            <span className="text-sm text-green-500 font-medium">
                                Скидка
                            </span>
                        )}
                    </div>
                </div>

                {/* Характеристики в сетке */}
                <div className="grid grid-cols-2 gap-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>{car.specs.mileage.toLocaleString()} км</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiZap className="w-4 h-4" />
                        <span>{car.specs.horsePower} л.с.</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiSettings className="w-4 h-4" />
                        <span>{car.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiDroplet className="w-4 h-4" />
                        <span>{car.specs.fuelType}</span>
                    </div>
                </div>
                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <OrderCarModal
                        isOpen={isOrderModalOpen}
                        onClose={() => setIsOrderModalOpen(false)}
                        car={car}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOrderModalOpen(true)
                        }}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Заказать
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/catalog/${carSlug}`)
                        }}
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
                    src={currentImage}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className={`
                        object-cover transform 
                        group-hover:scale-105 
                        transition-all duration-500 ease-out
                        ${
                            imageLoading
                                ? 'scale-105 blur-sm'
                                : 'scale-100 blur-0'
                        }
                    `}
                    onLoadingComplete={() => setImageLoading(false)}
                    priority={currentImageIndex === 0}
                />

                {/* Оверлей загрузки */}
                {imageLoading && <LoadingOverlay />}

                {/* Кнопки навигации */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handlePrevImage}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextImage}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors"
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Индикатор количества фотографий */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {currentImageIndex + 1} / {car.images.length}
                </div>
            </div>

            {/* Информация */}
            <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {car.brand} {car.model}
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                {car.year} г.
                            </span>
                            {car.discount && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                    Скидка
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-red-500">
                            {new Intl.NumberFormat('ru-RU').format(car.price)} ₽
                        </p>
                    </div>
                </div>

                {/* Характеристики в строку */}
                <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                            <FiClock className="w-4 h-4" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                                Пробег
                            </span>
                            <span className="text-sm font-medium">
                                {car.specs.mileage.toLocaleString()} км
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                            <FiZap className="w-4 h-4" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                                Двигатель
                            </span>
                            <span className="text-sm font-medium">
                                {car.specs.engineVolume}л /{' '}
                                {car.specs.horsePower}л.с.
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                            <FiSettings className="w-4 h-4" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">КПП</span>
                            <span className="text-sm font-medium">
                                {car.specs.transmission}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                            <FiDroplet className="w-4 h-4" />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                                Топливо
                            </span>
                            <span className="text-sm font-medium">
                                {car.specs.fuelType}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <OrderCarModal
                        isOpen={isOrderModalOpen}
                        onClose={() => setIsOrderModalOpen(false)}
                        car={car}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOrderModalOpen(true)
                        }}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Заказать
                    </button>
                    {/* <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsLiked(!isLiked)
                        }}
                        className={`px-4 py-3 rounded-xl border ${
                            isLiked
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                    >
                        <FiHeart className={isLiked ? 'fill-current' : ''} />
                    </button> */}
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
