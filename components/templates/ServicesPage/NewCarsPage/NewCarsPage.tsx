'use client'

import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { USED_CARS } from '@/shared/constants/breadcrumbs'

const NewCarsPage = () => {
    return (
        <section className="container">
            <Breadcrumbs items={USED_CARS} />
            <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Asia Motors - Доставка любого автомобиля из Китая
                </h1>
                <Image
                    src="/img/cars-dev.jpg"
                    alt="Автомобили из Китая"
                    width={800}
                    height={400}
                    className="mb-6"
                />
                {/* Добавляем кнопку возврата на главную */}
                <Link
                    href="/"
                    className="bg-[#2F3136] hover:bg-[#848482] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Вернуться на главную
                </Link>
            </div>
        </section>
    )
}

export default NewCarsPage
