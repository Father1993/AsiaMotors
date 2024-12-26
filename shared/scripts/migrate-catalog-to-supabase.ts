/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

// Загружаем переменные окружения из .env файла
dotenv.config()

import { supabase } from '../lib/superbase/client'
import { CountryId } from '../types/database.types'
import { carsData } from '../constants/catalog'

// Проверяем наличие необходимых переменных окружения
if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
    console.error(
        'Ошибка: Не найдены переменные окружения NEXT_PUBLIC_SUPABASE_URL или NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
    process.exit(1)
}

// Создаем прогресс бар
const progressBar = new cliProgress.MultiBar(
    {
        clearOnComplete: false,
        hideCursor: true,
    },
    cliProgress.Presets.shades_classic
)

async function uploadImage(filePath: string): Promise<string | null> {
    try {
        // Проверяем существование файла
        const fullPath = path.join(process.cwd(), 'public', filePath)
        if (!fs.existsSync(fullPath)) {
            console.error(`Файл не найден: ${fullPath}`)
            return null
        }

        // Читаем файл
        const fileBuffer = fs.readFileSync(fullPath)
        const fileExt = path.extname(filePath)

        // Генерируем уникальное имя файла
        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}${fileExt}`

        // Загружаем файл в Storage
        const { error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(fileName, fileBuffer, {
                contentType: `image/${fileExt.slice(1)}`,
                cacheControl: '3600',
            })

        if (uploadError) {
            throw uploadError
        }

        // Получаем публичный URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('car-images').getPublicUrl(fileName)

        return publicUrl
    } catch (error) {
        console.error(`Ошибка при загрузке изображения ${filePath}:`, error)
        return null
    }
}

async function migrateCatalog() {
    // Создаем счетчики для статистики
    let totalCars = 0
    let successfulCars = 0
    let failedCars = 0
    let totalImages = 0
    let successfulImages = 0

    // Считаем общее количество автомобилей и изображений
    Object.entries(carsData).forEach(([_, cars]) => {
        totalCars += cars.length
        cars.forEach((car) => {
            totalImages += car.images.length
        })
    })

    // Создаем прогресс бары
    const carsBar = progressBar.create(totalCars, 0, { name: 'Автомобили' })
    const imagesBar = progressBar.create(totalImages, 0, {
        name: 'Изображения',
    })

    for (const [countryId, cars] of Object.entries(carsData)) {
        for (const car of cars) {
            try {
                console.log(`\nОбработка ${car.brand} ${car.model}...`)

                // Загружаем изображения
                const uploadedImages: string[] = []
                for (const imagePath of car.images) {
                    const imageUrl = await uploadImage(imagePath)
                    if (imageUrl) {
                        uploadedImages.push(imageUrl)
                        successfulImages++
                    }
                    imagesBar.increment()
                }

                if (uploadedImages.length === 0) {
                    console.warn(
                        `Пропуск ${car.brand} ${car.model}: нет изображений`
                    )
                    failedCars++
                    continue
                }

                // Подготавливаем данные автомобиля с UUID
                const carData = {
                    id: uuidv4(),
                    country_id: countryId as CountryId,
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    category: car.category,
                    price: car.price,
                    equipment: car.specs.features?.join(', ') || '',
                    images: uploadedImages,
                    specs: {
                        mileage: car.specs.mileage,
                        engineVolume: car.specs.engineVolume,
                        fuelType: car.specs.fuelType,
                        horsePower: car.specs.horsePower,
                        transmission: car.specs.transmission,
                        driveType: car.specs.driveType,
                        color: car.specs.color || '',
                        generation: car.specs.generation || '',
                        features: car.specs.features || [],
                    },
                    available: car.available,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }

                // Проверяем соответствие типов
                const { error: insertError } = await supabase
                    .from('cars')
                    .insert(carData)

                if (insertError) {
                    throw insertError
                }

                successfulCars++
                console.log(`✅ Успешно импортирован ${car.brand} ${car.model}`)
            } catch (error) {
                failedCars++
                console.error(
                    `❌ Ошибка при импорте ${car.brand} ${car.model}:`,
                    error
                )
            }
            carsBar.increment()
        }
    }

    progressBar.stop()

    // Выводим итоговую статистику
    console.log('\n=== Статистика миграции ===')
    console.log(`Всего автомобилей: ${totalCars}`)
    console.log(`Успешно импортировано: ${successfulCars}`)
    console.log(`Ошибок: ${failedCars}`)
    console.log(`Всего изображений: ${totalImages}`)
    console.log(`Успешно загружено: ${successfulImages}`)
}

// Запускаем миграцию
console.log('🚀 Начинаем миграцию данных...')
migrateCatalog()
    .then(() => {
        console.log('✨ Миграция завершена')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Критическая оши��ка:', error)
        process.exit(1)
    })
