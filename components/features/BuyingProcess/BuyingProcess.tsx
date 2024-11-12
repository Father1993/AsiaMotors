const BuyingProcess = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Как купить автомобиль
                </h2>
                <div className="relative">
                    {/* Линия процесса */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Шаги процесса */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 relative z-10">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                Выбор автомобиля
                            </h3>
                            <p className="text-gray-600">
                                Подберем оптимальный вариант под ваши требования
                            </p>
                        </div>
                        {/* Другие шаги */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BuyingProcess
