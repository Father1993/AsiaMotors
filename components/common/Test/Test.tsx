'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '@/shared/lib/superbase/client'
import { Car } from '@/shared/types/adminTypes'
import Image from 'next/image'

const Test = () => {
    const [cars, setCars] = useState<Car[]>([])

    async function fetchData() {
        const { data: carsData, error: carsError } = await supabase
            .from('cars')
            .select('*')

        if (carsError) {
            toast.error(`Ошибка загрузки автомобилей: ${carsError.message}`)
            return
        }

        setCars(carsData || [])
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 mt-12">
                {cars.map((car) => (
                    <div
                        key={car.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        {car.images[0] && (
                            <div className="relative h-48">
                                <Image
                                    src={car.images[0]}
                                    alt={`${car.brand} ${car.model}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-4">
                            <h3 className="text-lg font-semibold">
                                {car.brand} {car.model}
                            </h3>
                            <p className="text-gray-600">{car.year} г.</p>
                            <p className="text-lg font-bold text-red-500 mt-2">
                                {car.price.toLocaleString()} ₽
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Test
