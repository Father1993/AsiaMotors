'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import {
    FiArrowLeft,
    // FiHeart,
    FiShare2,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi'
import { CarPageProps } from '@/shared/types/carPage'
import { CATALOG } from '@/shared/constants/breadcrumbs'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { formatPrice, generateCarSlug, specIcons } from '@/shared/utils/catalog'
import {
    TelegramShareButton,
    WhatsappShareButton,
    VKShareButton,
    TelegramIcon,
    WhatsappIcon,
    VKIcon,
} from 'react-share'
import SimilarCars from '@/components/features/SimilarCars/SimilarCars'
import { carsData } from '@/shared/constants/catalog'
import { OrderCarModal } from '../OrderCarModal'

const CarPageClient = ({ car }: CarPageProps) => {
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const carSlug = generateCarSlug(car)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

    const breadcrumbItems = [
        ...CATALOG,
        { label: `${car.brand} ${car.model}`, href: `/catalog/${car.id}` },
    ]

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? car.images.length - 1 : prev - 1
        )
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === car.images.length - 1 ? 0 : prev + 1
        )
    }

    // Конфигурация свайпов
    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNextImage,
        onSwipedRight: handlePrevImage,
        trackMouse: false,
        preventScrollOnSwipe: true,
        swipeDuration: 500,
        delta: 10,
    })

    // Функция для копирования ссылки
    const copyToClipboard = async () => {
        const url = `https://asiamotors.su/catalog/${carSlug}`

        await navigator.clipboard.writeText(url)
        setIsCopied(true)
        // Сбрасываем состояние через 2 секунды
        setTimeout(() => setIsCopied(false), 2000)
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

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="container mx-auto px-4 py-8">
                {/* Навигация */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Основной контент */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <FiArrowLeft />
                        Назад в каталог
                    </motion.button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Галерея */}
                        <div className="space-y-4">
                            <div
                                className="relative w-full aspect-video rounded-2xl overflow-hidden group"
                                {...swipeHandlers}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={car.images[currentImageIndex]}
                                            alt={`${car.brand} ${car.model} ${car.year}`}
                                            fill
                                            className="object-cover"
                                            priority
                                            draggable={false}
                                        />
                                        {/* Индикато�� свайпа на мобильных устройствах */}
                                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1 md:hidden">
                                            {car.images.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                                        index ===
                                                        currentImageIndex
                                                            ? 'bg-white scale-125'
                                                            : 'bg-white/50'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {car.images.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                                        <button
                                            onClick={handlePrevImage}
                                            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                                        >
                                            <FiChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                                        >
                                            <FiChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Миниатюры */}
                            {car.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {car.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentImageIndex(index)
                                            }
                                            className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 
                        ${
                            currentImageIndex === index
                                ? 'ring-2 ring-red-600'
                                : ''
                        }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${car.brand} ${
                                                    car.model
                                                } ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Информация */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {car.brand} {car.model} {car.year}
                                    </h1>
                                    <p className="text-xl text-gray-600 mt-1">
                                        {car.category}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    {/* <button className="p-2 rounded-full hover:bg-gray-100">
                                        <FiHeart className="w-6 h-6" />
                                    </button> */}

                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            setIsShareModalOpen(
                                                !isShareModalOpen
                                            )
                                        }
                                        className="p-2 rounded-full bg-white text-gray-700 relative cursor-pointer"
                                    >
                                        <FiShare2 />

                                        {/* Модальное окно шеринга */}
                                        {isShareModalOpen && (
                                            <div
                                                ref={shareModalRef}
                                                className="absolute right-0 top-12 bg-white p-4 rounded-xl shadow-lg z-50 flex gap-2"
                                            >
                                                <WhatsappShareButton
                                                    url={`https://asiamotors.su/catalog/${carSlug}`}
                                                    title={`${car.brand} ${car.brand} - ${car.price}`}
                                                >
                                                    <WhatsappIcon
                                                        size={32}
                                                        round
                                                    />
                                                </WhatsappShareButton>

                                                <TelegramShareButton
                                                    url={`https://asiamotors.su/catalog/${carSlug}`}
                                                    title={`${car.brand} ${car.brand} - ${car.price}`}
                                                >
                                                    <TelegramIcon
                                                        size={32}
                                                        round
                                                    />
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
                                                            e.stopPropagation() // Предотвращаем закрытие модального о��на
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

                            {/* Цена и статус */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h2 className="text-3xl font-bold text-red-600">
                                        {formatPrice(car.price)}
                                        <span className="special__text-for-price">
                                            -цена под ключ в РФ
                                        </span>
                                    </h2>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium w-fit mx-auto mt-2 sm:mt-0 sm:mx-0 bg-green-100 text-green-800`}
                                    >
                                        {car.available
                                            ? 'В наличии'
                                            : 'Под заказ'}
                                    </span>
                                </div>
                            </div>

                            {/* Характеристики */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">
                                    Характеристики
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        {specIcons.engineVolume}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Двигатель
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.engineVolume}л /{' '}
                                                {car.specs.fuelType}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {specIcons.mileage}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Пробег
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.mileage.toLocaleString()}{' '}
                                                км
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {specIcons.horsePower}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Мощность
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.horsePower} л.с.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {specIcons.transmission}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                КПП
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.transmission}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {specIcons.drive}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Привод
                                            </p>
                                            <p className="font-medium">
                                                {car.specs.driveType}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {specIcons.year}
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Год выпуска
                                            </p>
                                            <p className="font-medium">
                                                {car.year}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="flex gap-4 pt-4">
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
                            </div>
                        </div>
                    </div>
                    <SimilarCars
                        currentCar={car}
                        allCars={Object.values(carsData).flat()}
                    />
                </div>
            </div>
        </div>
    )
}

export default CarPageClient
