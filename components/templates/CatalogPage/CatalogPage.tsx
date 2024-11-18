'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { FiSearch, FiGrid, FiList } from 'react-icons/fi'
import { HiOutlineAdjustments } from 'react-icons/hi'
import { CountryId } from '@/shared/types/catalog'
import { carsData, countries } from '@/shared/constants/catalog'
import CarCard from './CarCard'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { CATALOG } from '@/shared/constants/breadcrumbs'

const CatalogPage = () => {
    const [selectedCountry, setSelectedCountry] = useState<CountryId>('china')
    const [selectedCategory] = useState<string>('Все')
    const [selectedPrice] = useState<string>('Все цены')
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState<string>('')

    // Фильтрация автомобилей
    const filteredCars =
        carsData[selectedCountry]?.filter((car) => {
            const matchesSearch = car.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            const matchesCategory =
                selectedCategory === 'Все' || car.category === selectedCategory
            const matchesPrice =
                selectedPrice === 'Все цены' ||
                car.price.includes(selectedPrice)
            return matchesSearch && matchesCategory && matchesPrice
        }) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs items={CATALOG} />
                {/* Hero секция */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative rounded-3xl overflow-hidden mb-12 h-[400px]"
                >
                    <Image
                        src="/img/catalog/bg.jpg"
                        alt="Каталог автомобилей"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                        <div className="px-8 md:px-16 max-w-3xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                            >
                                Найдите свой идеальный автомобиль
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-gray-200 mb-8"
                            >
                                Широкий выбор автомобилей из Азии с гарантией и
                                поддержкой
                            </motion.p>

                            {/* Поиск */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Поиск по марке или модели..."
                                    className="w-full px-6 py-4 pl-14 text-lg rounded-2xl bg-white/95 
                                        backdrop-blur-sm border-0 focus:ring-2 focus:ring-red-500
                                        transition-all duration-300 shadow-lg"
                                />
                                <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Навигация по странам */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-wrap gap-4 justify-center">
                        {countries.map((country) => (
                            <button
                                key={country.id}
                                onClick={() => setSelectedCountry(country.id)}
                                className={`group px-8 py-4 rounded-2xl text-lg font-medium 
                    transition-all duration-300 ${
                        selectedCountry === country.id
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-lg'
                    }`}
                            >
                                <span>{country.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Панель управления */}
                <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <FiGrid size={24} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <FiList size={24} />
                        </button>
                        <span className="text-gray-500">
                            Найдено: {filteredCars.length}
                        </span>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all"
                    >
                        <HiOutlineAdjustments className="text-gray-500" />
                        <span>Фильтры</span>
                    </button>
                </div>

                {/* Фильтры */}
                <motion.div
                    initial={false}
                    animate={{ height: isFilterOpen ? 'auto' : 0 }}
                    className="overflow-hidden mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                        {/* ... фильтры ... */}
                    </div>
                </motion.div>

                {/* Сетка автомобилей */}
                <motion.div
                    layout
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                            : 'space-y-6'
                    }
                >
                    {filteredCars.map((car) => (
                        <CarCard key={car.id} car={car} viewMode={viewMode} />
                    ))}
                </motion.div>

                {/* Нет результатов */}
                {filteredCars.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <p className="text-2xl text-gray-500">
                            По вашему запросу ничего не найдено
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default CatalogPage
