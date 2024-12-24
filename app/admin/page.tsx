'use client'
import { useEffect, useState } from 'react'
import { Database } from '@/shared/types/database.types'
import { supabase } from '@/shared/lib/superbase/client'
import Image from 'next/image'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { CarForm } from '@/components/templates/AdminPage/CarForm'

type Car = Database['public']['Tables']['cars']['Row']
type Country = Database['public']['Tables']['countries']['Row']

export default function AdminPage() {
    const [cars, setCars] = useState<Car[]>([])
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCar, setSelectedCar] = useState<Car | null>(null)

    // Загрузка данных
    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)

            // Прямой запрос к таблице стран
            const { data: testCountries, error: testError } = await supabase
                .from('countries')
                .select('*')

            console.log('Тестовый запрос стран:', {
                data: testCountries,
                error: testError,
                status: testError?.status,
                message: testError?.message,
            })

            if (testError) {
                throw new Error(`Ошибка загрузки стран: ${testError.message}`)
            }

            // Проверяем, что данные существуют
            if (!testCountries || testCountries.length === 0) {
                throw new Error('Таблица стран пуста')
            }

            setCountries(testCountries)

            // Загружаем автомобили
            const { data: carsData, error: carsError } = await supabase
                .from('cars')
                .select('*')

            if (carsError) {
                throw new Error(
                    `Ошибка загрузки автомобилей: ${carsError.message}`
                )
            }

            setCars(carsData || [])
        } catch (err) {
            console.error('Подробная ошибка:', err)
            setError(err instanceof Error ? err.message : 'Произошла ошибка')
        } finally {
            setLoading(false)
        }
    }

    // Удаление автомобиля
    const handleDelete = async (carId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) return

        try {
            // Получаем данные автомобиля перед удалением
            const { data: carData, error: fetchError } = await supabase
                .from('cars')
                .select('*')
                .eq('id', carId)
                .single()

            if (fetchError) throw fetchError

            // Удаляем изображения из storage
            if (carData.images && carData.images.length > 0) {
                for (const imageUrl of carData.images) {
                    // Получаем имя файла из URL
                    const fileName = imageUrl.split('/').pop()
                    if (fileName) {
                        const { error: storageError } = await supabase.storage
                            .from('car-images')
                            .remove([fileName])

                        if (storageError) {
                            console.error(
                                'Ошибка удаления изображения:',
                                storageError
                            )
                        }
                    }
                }
            }

            // Удаляем запись из базы данных
            const { error: deleteError } = await supabase
                .from('cars')
                .delete()
                .eq('id', carId)

            if (deleteError) throw deleteError

            // Обновляем список после удаления
            setCars(cars.filter((car) => car.id !== carId))
        } catch (err) {
            console.error('Ошибка при удалении:', err)
            alert('Ошибка при удалении автомобиля')
        }
    }

    if (loading) return <div className="p-8">Загрузка...</div>
    if (error) return <div className="p-8 text-red-500">Ошибка: {error}</div>

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление автомобилями</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <FiPlus />
                    Добавить автомобиль
                </button>
            </div>

            {/* Список автомобилей */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedCar(car)
                                        setIsEditModalOpen(true)
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDelete(car.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Добавить модальные окна */}
            {isAddModalOpen && (
                <CarForm
                    countries={countries}
                    onSubmit={() => {
                        setIsAddModalOpen(false)
                        fetchData() // ��бновляем список после добавления
                    }}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}

            {isEditModalOpen && selectedCar && (
                <CarForm
                    car={selectedCar}
                    countries={countries}
                    onSubmit={() => {
                        setIsEditModalOpen(false)
                        setSelectedCar(null)
                        fetchData() // Обновляем список после редактирования
                    }}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setSelectedCar(null)
                    }}
                />
            )}
        </div>
    )
}
