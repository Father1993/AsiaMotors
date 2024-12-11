/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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

    // Переменные для фильтра
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 9000000])
    const [yearRange, setYearRange] = useState<[number, number]>([2010, 2023])
    const [selectedDriveTypes, setSelectedDriveTypes] = useState<string[]>([])
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([])

    type ValidKeys = 'brand' | 'category' | 'specs.driveType' | 'specs.fuelType'

    // Получаем уникальные значения
    const getUniqueValues = (key: ValidKeys) => {
        const allCars = Object.values(carsData).flat()

        switch (key) {
            case 'specs.driveType':
                return [...new Set(allCars.map((car) => car.specs.driveType))]
            case 'specs.fuelType':
                return [...new Set(allCars.map((car) => car.specs.fuelType))]
            case 'brand':
                return [...new Set(allCars.map((car) => car.brand))]
            case 'category':
                return [...new Set(allCars.map((car) => car.category))]
            default:
                return []
        }
    }

    const brands = getUniqueValues('brand')
    const categories = getUniqueValues('category')
    const driveTypes = getUniqueValues('specs.driveType')
    const fuelTypes = getUniqueValues('specs.fuelType')

    // Фильтрация автомобилей
    const filteredCars =
        carsData[selectedCountry]?.filter((car) => {
            const matchesSearch =
                searchQuery === '' ||
                car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.model.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.includes(car.brand)
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(car.category)
            const matchesPrice =
                car.price >= priceRange[0] && car.price <= priceRange[1]
            const matchesYear =
                car.year >= yearRange[0] && car.year <= yearRange[1]
            const matchesDriveType =
                selectedDriveTypes.length === 0 ||
                selectedDriveTypes.includes(car.specs.driveType)
            const matchesFuelType =
                selectedFuelTypes.length === 0 ||
                selectedFuelTypes.includes(car.specs.fuelType)

            return (
                matchesSearch &&
                matchesBrand &&
                matchesCategory &&
                matchesPrice &&
                matchesYear &&
                matchesDriveType &&
                matchesFuelType
            )
        }) || []

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && viewMode === 'list') {
                setViewMode('grid')
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize() // Проверяем при монтировании

        return () => window.removeEventListener('resize', handleResize)
    }, [viewMode])

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
                            ? 'bg-[#2F3136] text-white shadow-lg scale-105'
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
                            className={`hidden md:block p-2 rounded-lg transition-colors ${
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
                        {/* Бренды */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Марка</h3>
                            <div className="flex flex-wrap gap-2">
                                {brands.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => {
                                            setSelectedBrands((prev) =>
                                                prev.includes(brand)
                                                    ? prev.filter(
                                                          (b) => b !== brand
                                                      )
                                                    : [...prev, brand]
                                            )
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedBrands.includes(brand)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Категории */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">
                                Тип кузова
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategories((prev) =>
                                                prev.includes(category)
                                                    ? prev.filter(
                                                          (c) => c !== category
                                                      )
                                                    : [...prev, category]
                                            )
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedCategories.includes(
                                                category
                                            )
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Цена */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Цена</h3>
                            <div className="px-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={5000000}
                                    step={100000}
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            priceRange[0],
                                            Number(e.target.value),
                                        ])
                                    }
                                    className="w-full text-black"
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>
                                        {priceRange[0].toLocaleString()} ₽
                                    </span>
                                    <span>
                                        {priceRange[1].toLocaleString()} ₽
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Привод */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Привод</h3>
                            <div className="flex flex-wrap gap-2">
                                {driveTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setSelectedDriveTypes((prev) =>
                                                prev.includes(type)
                                                    ? prev.filter(
                                                          (t) => t !== type
                                                      )
                                                    : [...prev, type]
                                            )
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedDriveTypes.includes(type)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Тип топлива */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">
                                Тип топлива
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {fuelTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setSelectedFuelTypes((prev) =>
                                                prev.includes(type)
                                                    ? prev.filter(
                                                          (t) => t !== type
                                                      )
                                                    : [...prev, type]
                                            )
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedFuelTypes.includes(type)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Кнопка сброса */}
                        <button
                            onClick={() => {
                                setSelectedBrands([])
                                setSelectedCategories([])
                                setPriceRange([0, 5000000])
                                setYearRange([2020, 2023])
                                setSelectedDriveTypes([])
                                setSelectedFuelTypes([])
                            }}
                            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Сбросить все фильтры
                        </button>
                    </div>
                </motion.div>

                {/* Сетка автомобилей */}
                <motion.div
                    layout
                    className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20'
                            : 'space-y-6 pb-20'
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
