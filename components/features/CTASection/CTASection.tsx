const CTASection = () => {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="container text-center">
                <h2 className="text-4xl font-bold mb-8">
                    Готовы приобрести автомобиль мечты?
                </h2>
                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                    Оставьте заявку прямо сейчас и получите персональное
                    предложение
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
                    Получить предложение
                </button>
            </div>
        </section>
    )
}

export default CTASection
