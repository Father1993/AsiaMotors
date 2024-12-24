'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Database } from '@/shared/types/database.types'
import { supabase } from '@/shared/lib/superbase/client'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import { CarForm } from '@/components/templates/AdminPage/CarForm'

type Car = Database['public']['Tables']['cars']['Row']
type Country = Database['public']['Tables']['countries']['Row']

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [cars, setCars] = useState<Car[]>([])
    const [countries, setCountries] = useState<Country[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCar, setSelectedCar] = useState<Car | null>(null)

    useEffect(() => {
        if (status === 'loading') return

        if (status === 'unauthenticated') {
            router.push('/auth/signin')
            return
        }

        if (!session?.user?.isAdmin) {
            router.push('/auth/error?error=AccessDenied')
            return
        }

        fetchData()
    }, [session, status, router])

    async function fetchData() {
        try {
            const { data: countriesData, error: countriesError } =
                await supabase.from('countries').select('*')

            if (countriesError) {
                toast.error(`Ошибка загрузки стран: ${countriesError.message}`)
                return
            }

            if (!countriesData || countriesData.length === 0) {
                toast.error('Таблица стран пуста')
                return
            }

            setCountries(countriesData)

            const { data: carsData, error: carsError } = await supabase
                .from('cars')
                .select('*')

            if (carsError) {
                toast.error(`Ошибка загрузки автомобилей: ${carsError.message}`)
                return
            }

            setCars(carsData || [])
        } catch {
            toast.error('Произошла ошибка при загрузке данных')
        }
    }

    const handleDelete = async (carId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) return

        try {
            const { data: carData, error: fetchError } = await supabase
                .from('cars')
                .select('*')
                .eq('id', carId)
                .single()

            if (fetchError) {
                toast.error('Ошибка при получении данных автомобиля')
                return
            }

            if (carData.images && carData.images.length > 0) {
                for (const imageUrl of carData.images) {
                    const fileName = imageUrl.split('/').pop()
                    if (fileName) {
                        const { error: storageError } = await supabase.storage
                            .from('car-images')
                            .remove([fileName])

                        if (storageError) {
                            toast.error('Ошибка при удалении изображений')
                        }
                    }
                }
            }

            const { error: deleteError } = await supabase
                .from('cars')
                .delete()
                .eq('id', carId)

            if (deleteError) {
                toast.error('Ошибка при удалении автомобиля')
                return
            }

            setCars(cars.filter((car) => car.id !== carId))
            toast.success('Автомобиль успешно удален')
        } catch {
            toast.error('Произошла ошибка при удалении автомобиля')
        }
    }

    if (status === 'loading') {
        return <div className="p-8">Загрузка...</div>
    }

    if (!session?.user?.isAdmin) {
        return null // Редирект будет выполнен в useEffect
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Управление автомобилями
                    </h1>
                    <p className="text-gray-600">
                        Вы вошли как: {session.user.email}
                    </p>
                </div>
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
                        fetchData() // Обновляем список после добавления
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
