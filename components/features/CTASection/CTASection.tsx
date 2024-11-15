const CTASection = () => {
    return (
        <section
            className="py-20 relative bg-cover bg-center bg-fixed bg-no-repeat text-white overflow-hidden"
            style={{
                backgroundImage: `
                    linear-gradient(
                        to bottom,
                        rgba(17, 24, 39, 0.7) 0%,
                        rgba(17, 24, 39, 0.8) 50%,
                        rgba(17, 24, 39, 0.85) 100%
                    ),
                    url('/img/bg-cta.jpg')
                `,
            }}
        >
            <div className="absolute inset-0 bg-black/10" />
            <div className="container relative z-10 text-center">
                <h2 className="text-4xl font-bold mb-8 text-white/90">
                    Готовы приобрести автомобиль мечты?
                </h2>
                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                    Оставьте заявку прямо сейчас и получите персональное
                    предложение
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/20">
                    Получить предложение
                </button>
            </div>
        </section>
    )
}

export default CTASection
