'use client'

import { useState } from 'react'

// Временные данные для демонстрации
// В будущем эти данные будут получаться из БД
const BRANDS = [
    { id: 1, name: 'HONGQI' },
    { id: 2, name: 'TANK' },
    { id: 3, name: 'LI AUTO' },
    { id: 4, name: 'ZEEKR' },
    { id: 5, name: 'BYD' },
    { id: 6, name: 'EXEED' },
    { id: 7, name: 'CHERY' },
    { id: 8, name: 'GEELY' },
    { id: 9, name: 'HAVAL' },
    { id: 10, name: 'GAC' },
]

const PRICE_RANGES = [
    { id: 1, name: 'До 2 000 000 ₽' },
    { id: 2, name: '2 000 000 ₽ - 3 000 000 ₽' },
    { id: 3, name: '3 000 000 ₽ - 4 000 000 ₽' },
    { id: 4, name: '4 000 000 ₽ - 5 000 000 ₽' },
    { id: 5, name: '5 000 000 ₽ - 7 000 000 ₽' },
    { id: 6, name: 'Более 7 000 000 ₽' },
]

const BODY_TYPES = [
    { id: 1, name: 'Седан' },
    { id: 2, name: 'Кроссовер' },
    { id: 3, name: 'Внедорожник' },
    { id: 4, name: 'Хэтчбек' },
    { id: 5, name: 'Минивэн' },
]

const SmartSearch = () => {
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedPrice, setSelectedPrice] = useState('')
    const [selectedBody, setSelectedBody] = useState('')

    const handleSearch = () => {
        // В будущем здесь будет логика поиска по БД
        console.log('Поиск с параметрами:', {
            brand: selectedBrand,
            price: selectedPrice,
            bodyType: selectedBody,
        })
    }

    return (
        <section className="py-12 bg-white">
            <div className="container">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Найдите свой идеальный автомобиль
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <select
                                className="form-select w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                value={selectedBrand}
                                onChange={(e) =>
                                    setSelectedBrand(e.target.value)
                                }
                            >
                                <option value="">Выберите бренд</option>
                                {BRANDS.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                value={selectedPrice}
                                onChange={(e) =>
                                    setSelectedPrice(e.target.value)
                                }
                            >
                                <option value="">Ценовой диапазон</option>
                                {PRICE_RANGES.map((range) => (
                                    <option key={range.id} value={range.id}>
                                        {range.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-select w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                value={selectedBody}
                                onChange={(e) =>
                                    setSelectedBody(e.target.value)
                                }
                            >
                                <option value="">Тип кузова</option>
                                {BODY_TYPES.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleSearch}
                                className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <span>Найти</span>
                            </button>
                        </div>
                    </div>

                    {/* Быстрые фильтры */}
                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                            Новинки 2024
                        </button>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                            Электромобили
                        </button>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                            Премиум класс
                        </button>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
                            Семейные авто
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SmartSearch
