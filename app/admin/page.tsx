'use client'
import { useEffect, useState } from 'react'
import { Database } from '@/shared/types/database.types'
import { supabase } from '@/shared/lib/superbase/client'

type Car = Database['public']['Tables']['cars']['Row']
type Country = Database['public']['Tables']['countries']['Row']
export default function AdminPage() {
    const [cars, setCars] = useState<Car[]>([])
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        async function fetchData() {
            try {
                // Получаем страны
                const { data: countriesData, error: countriesError } =
                    await supabase.from('countries').select('*')
                if (countriesError) throw countriesError
                // Получаем автомобили
                const { data: carsData, error: carsError } = await supabase
                    .from('cars')
                    .select('*')
                if (carsError) throw carsError
                setCountries(countriesData)
                setCars(carsData)
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Произошла ошибка'
                )
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    if (loading) return <div className="p-8">Загрузка...</div>
    if (error) return <div className="p-8 text-red-500">Ошибка: {error}</div>
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Данные из Supabase</h1>

            {/* Отображение стран */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Страны:</h2>
                <div className="grid grid-cols-1 gap-4">
                    {countries.map((country) => (
                        <div
                            key={country.id}
                            className="p-4 bg-white rounded shadow"
                        >
                            <p>ID: {country.id}</p>
                            <p>Название: {country.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Отображение автомобилей */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Автомобили:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className="p-4 bg-white rounded shadow"
                        >
                            <h3 className="font-bold">
                                {car.brand} {car.model}
                            </h3>
                            <p>Год: {car.year}</p>
                            <p>Цена: {car.price.toLocaleString()} ₽</p>
                            <p>Категория: {car.category}</p>
                            {car.images.length > 0 && (
                                <img
                                    src={car.images[0]}
                                    alt={`${car.brand} ${car.model}`}
                                    className="w-full h-48 object-cover mt-2 rounded"
                                />
                            )}
                            <div className="mt-2">
                                <p>Характеристики:</p>
                                <ul className="list-disc list-inside">
                                    <li>Пробег: {car.specs.mileage} км</li>
                                    <li>
                                        Двигатель: {car.specs.engineVolume}л
                                    </li>
                                    <li>Топливо: {car.specs.fuelType}</li>
                                    <li>
                                        Мощность: {car.specs.horsePower} л.с.
                                    </li>
                                    <li>КПП: {car.specs.transmission}</li>
                                    <li>Привод: {car.specs.driveType}</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
