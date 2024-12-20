import path from 'path'
import { supabase } from '../client'
import { countries, carsData } from '@/shared/constants/catalog'
import { uploadImageToStorage } from './storage'

export async function migrateData() {
    // Миграция стран
    for (const country of countries) {
        const { error } = await supabase.from('countries').upsert({
            id: country.id,
            name: country.name,
        })
        if (error) {
            console.error('Ошибка миграции страны:', error)
            continue
        }
    }
    // Миграция автомобилей
    for (const [countryId, cars] of Object.entries(carsData)) {
        for (const car of cars) {
            try {
                // Загрузка изображений
                const newImages = []
                for (const imagePath of car.images) {
                    // Формируем путь к локальному файлу
                    const fullPath = path.join(
                        process.cwd(),
                        'public',
                        imagePath
                    )

                    // Формируем имя файла для Storage
                    // Например: china/BYD-Han/1.jpg
                    const fileName = `${countryId}/${car.brand}-${
                        car.model
                    }/${path.basename(imagePath)}`

                    console.log(`Загрузка изображения: ${fileName}`)

                    const publicUrl = await uploadImageToStorage(
                        fullPath,
                        fileName
                    )
                    if (publicUrl) {
                        newImages.push(publicUrl)
                        console.log(`Успешно загружено: ${publicUrl}`)
                    }
                }
                // Добавление автомобиля в БД
                const { error } = await supabase.from('cars').upsert({
                    id: car.id,
                    country_id: countryId,
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    category: car.category,
                    price: car.price,
                    equipment: car.equipment,
                    images: newImages, // Сохраняем массив URL-ов из Storage
                    specs: car.specs,
                    available: car.available,
                    created_at: new Date(car.createdAt).toISOString(),
                    updated_at: new Date(car.updatedAt).toISOString(),
                })
                if (error) {
                    throw error
                }
                console.log(
                    `Успешно добавлен автомобиль: ${car.brand} ${car.model}`
                )
            } catch (error) {
                console.error(
                    `Ошибка миграции автомобиля ${car.brand} ${car.model}:`,
                    error
                )
            }
        }
    }
}
