'use client'

const SmartSearch = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Найдите свой идеальный автомобиль
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Селекторы для поиска */}
                        <select className="form-select rounded-xl border-gray-300">
                            <option>Бренд</option>
                            {/* Опции брендов */}
                        </select>
                        <select className="form-select rounded-xl border-gray-300">
                            <option>Ценовой диапазон</option>
                            {/* Ценовые диапазоны */}
                        </select>
                        <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl transition-colors">
                            Найти автомобиль
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SmartSearch
