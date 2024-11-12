const Benefits = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Почему выбирают AsiaMotors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Карточки преимуществ */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* Иконка */}
                        </div>
                        <h3 className="text-xl font-bold mb-4">
                            Прямые поставки
                        </h3>
                        <p className="text-gray-600">
                            Работаем напрямую с производителями из Китая
                        </p>
                    </div>
                    {/* Другие преимущества */}
                </div>
            </div>
        </section>
    )
}

export default Benefits
