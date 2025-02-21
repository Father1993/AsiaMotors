'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Categories = () => {
    const router = useRouter()
    const handleGoCatalog = () => {
        router.push('/catalog')
    }

    return (
        <section className="py-20">
            <div className="container">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Каталог автомобилей
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Карточки категорий */}
                    <div
                        onClick={handleGoCatalog}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <Image
                            fill
                            src="/img/categories/catalog-suv.webp"
                            alt="SUV"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            quality={75}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Кроссоверы и SUV
                                </h3>
                                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent inline-block">
                                    от 2 500 000 ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={handleGoCatalog}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <Image
                            fill
                            src="/img/categories/catalog-sedan.webp"
                            alt="sedan cars"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Седаны
                                </h3>
                                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent inline-block">
                                    от 1 500 000 ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={handleGoCatalog}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <Image
                            fill
                            src="/img/categories/catalog-hach.webp"
                            alt="hachback cars"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Хэтчбеки
                                </h3>
                                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent inline-block">
                                    от 1 800 000 ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={handleGoCatalog}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <Image
                            fill
                            src="/img/categories/catalog-minivan.webp"
                            alt="Minivans cars"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Минивэны
                                </h3>
                                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent inline-block">
                                    от 1 900 000 ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={handleGoCatalog}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <Image
                            fill
                            src="/img/categories/catalog-pickup.webp"
                            alt="Pickups cars"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Пикапы
                                </h3>
                                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent inline-block">
                                    от 2 300 000 ₽
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={handleGoCatalog}
                        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <Image
                            fill
                            src="/img/categories/catalog-universal.webp"
                            alt="Pickups cars"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                            loading="lazy"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Универсалы
                                </h3>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent inline-block">
                                        от 1 500 000 ₽
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Categories
