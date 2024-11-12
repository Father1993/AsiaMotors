import Image from 'next/image'

const Categories = () => {
    return (
        <section className="py-20">
            <div className="container">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Каталог автомобилей
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Карточки категорий */}
                    <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
                        <Image
                            fill
                            src="/img/categories/suv.jpg"
                            alt="SUV"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Кроссоверы и SUV
                                </h3>
                                <p className="text-white/80">от 2 500 000 ₽</p>
                            </div>
                        </div>
                    </div>
                    {/* Другие категории */}
                </div>
            </div>
        </section>
    )
}

export default Categories
