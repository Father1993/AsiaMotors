/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { CountryId } from '@/shared/types/database.types'
import { supabase } from '@/shared/lib/superbase/client'
import { categories } from '@/shared/types/catalog'
import { FiUpload, FiX, FiX as FiClose } from 'react-icons/fi'
import {
    CarFormProps,
    FormData,
    MAX_FILE_SIZE,
    MAX_FILE_SIZE_MB,
} from '@/shared/types/adminTypes'
import ImageSkeleton from '@/components/common/ImageSkeleton/ImageSkeleton'
import Image from 'next/image'

export const CarForm = ({
    car,
    countries,
    onSubmit,
    onClose,
}: CarFormProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [uploadingImages, setUploadingImages] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLDivElement>(null)
    const [loadingImages, setLoadingImages] = useState<{
        [key: string]: boolean
    }>({})

    const [formData, setFormData] = useState<FormData>({
        country_id: car?.country_id || ('' as CountryId),
        brand: car?.brand || '',
        model: car?.model || '',
        year: car?.year || new Date().getFullYear(),
        category: car?.category || '',
        price: car?.price || 0,
        equipment: car?.equipment || '',
        images: car?.images || [],
        specs: {
            mileage: car?.specs?.mileage || 0,
            engineVolume: car?.specs?.engineVolume || 0,
            fuelType: car?.specs?.fuelType || '',
            horsePower: car?.specs?.horsePower || 0,
            transmission: car?.specs?.transmission || '',
            driveType: car?.specs?.driveType || '',
            color: car?.specs?.color || '',
            generation: car?.specs?.generation || '',
            features: car?.specs?.features || [],
        },
        available: car?.available ?? true,
    })

    const [previewImages, setPreviewImages] = useState<string[]>(
        car?.images || []
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                formRef.current &&
                !formRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'country_id'
                    ? (value as CountryId)
                    : ['year', 'price'].includes(name)
                    ? Number(value)
                    : value,
        }))
    }

    const handleSpecsChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            specs: {
                ...prev.specs,
                [name]: ['mileage', 'engineVolume', 'horsePower'].includes(name)
                    ? Number(value)
                    : value,
            },
        }))
    }

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImages(true)
        const newImages: string[] = []

        try {
            for (const file of files) {
                if (file.size > MAX_FILE_SIZE) {
                    throw new Error(
                        `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE_MB}`
                    )
                }

                if (!file.type.startsWith('image/')) {
                    throw new Error('Можно загружать только изображения')
                }

                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('car-images')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.type,
                    })

                if (uploadError) throw uploadError

                const {
                    data: { publicUrl },
                } = supabase.storage.from('car-images').getPublicUrl(fileName)

                newImages.push(publicUrl)
            }

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
            }))
            setPreviewImages((prev) => [...prev, ...newImages])
            toast.success('Изображения успешно загружены')
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Ошибка при загрузке изображений'
            )
        } finally {
            setUploadingImages(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemoveImage = async (indexToRemove: number) => {
        const imageUrl = previewImages[indexToRemove]
        try {
            const fileName = imageUrl.split('/').pop()
            if (!fileName) throw new Error('Не удалось получить имя файла')

            const { error: storageError } = await supabase.storage
                .from('car-images')
                .remove([fileName])

            if (storageError) throw storageError

            setFormData((prev) => ({
                ...prev,
                images: prev.images.filter(
                    (_, index) => index !== indexToRemove
                ),
            }))
            setPreviewImages((prev) =>
                prev.filter((_, index) => index !== indexToRemove)
            )
            toast.success('Изображение успешно удалено')
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Ошибка при удалении изображения'
            )
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.country_id) {
            setError('Выберите страну производителя')
            return
        }

        setLoading(true)

        try {
            const now = new Date().toISOString()

            if (car) {
                const { error: updateError } = await supabase
                    .from('cars')
                    .update({
                        ...formData,
                        updated_at: now,
                    })
                    .eq('id', car.id)

                if (updateError) throw updateError
                toast.success('Автомобиль успешно обновлен')
            } else {
                const { error: insertError } = await supabase
                    .from('cars')
                    .insert({
                        ...formData,
                        created_at: now,
                        updated_at: now,
                    })

                if (insertError) throw insertError
                toast.success('Автомобиль успешно добавлен')
            }

            onSubmit()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Произошла ошибка при сохранении'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                ref={formRef}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiClose className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4 pr-10">
                    {car
                        ? 'Редактирование автомобиля'
                        : 'Добавление автомобиля'}
                </h2>

                <div className="mb-4 text-sm text-gray-500">
                    Доступные страны: {countries.length}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Основная информация */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Страна производитель
                            </label>
                            <select
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Выберите страну</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Марка
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Модель
                            </label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Год выпуска
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Цена (₽)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Категория
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="">Выберите категорию</option>
                                {categories
                                    .filter((cat) => cat !== 'Все')
                                    .map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Комплектация
                            </label>
                            <textarea
                                name="equipment"
                                value={formData.equipment || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={formData.available}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            available: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Доступен для заказа
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Характеристики */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">
                            Характеристики
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Пробег (км)
                                </label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.specs.mileage}
                                    onChange={handleSpecsChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Объем двигателя (л)
                                </label>
                                <input
                                    type="number"
                                    name="engineVolume"
                                    value={formData.specs.engineVolume}
                                    onChange={handleSpecsChange}
                                    step="0.1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Тип топлива
                                </label>
                                <select
                                    name="fuelType"
                                    value={formData.specs.fuelType}
                                    onChange={handleSpecsChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Выберите тип</option>
                                    <option value="Бензин">Бензин</option>
                                    <option value="Дизель">Дизель</option>
                                    <option value="Гибрид">Гибрид</option>
                                    <option value="Электро">Электро</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Мощность (л.с.)
                                </label>
                                <input
                                    type="number"
                                    name="horsePower"
                                    value={formData.specs.horsePower}
                                    onChange={handleSpecsChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Коробка передач
                                </label>
                                <select
                                    name="transmission"
                                    value={formData.specs.transmission}
                                    onChange={handleSpecsChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Выберите тип</option>
                                    <option value="Механика">Механика</option>
                                    <option value="Автомат">Автомат</option>
                                    <option value="Робот">Робот</option>
                                    <option value="Вариатор">Вариатор</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Привод
                                </label>
                                <select
                                    name="driveType"
                                    value={formData.specs.driveType}
                                    onChange={handleSpecsChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Выберите тип</option>
                                    <option value="Передний">Передний</option>
                                    <option value="Задний">Задний</option>
                                    <option value="Полный">Полный</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Секция загрузки изображений */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">
                            Изображения
                        </h3>

                        {/* Превью загруженных изображений */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {previewImages.map((url, index) => (
                                <div key={url} className="relative group">
                                    {loadingImages[url] ? (
                                        <ImageSkeleton
                                            size="md"
                                            showIcon={true}
                                        />
                                    ) : (
                                        <div className="relative aspect-video">
                                            {index === 0 && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-md z-10">
                                                    Главное фото
                                                </div>
                                            )}
                                            <Image
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover rounded-lg"
                                                onLoad={() => {
                                                    setLoadingImages(
                                                        (prev) => ({
                                                            ...prev,
                                                            [url]: false,
                                                        })
                                                    )
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveImage(index)
                                                }
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 transform hover:scale-110"
                                                disabled={uploadingImages}
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Кнопка загрузки */}
                        <div className="flex items-center justify-center w-full">
                            <label
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                    uploadingImages
                                        ? 'bg-gray-100 border-gray-400'
                                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploadingImages ? (
                                        <>
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Загрузка...
                                                </span>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Нажмите для загрузки
                                                </span>
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImages}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
