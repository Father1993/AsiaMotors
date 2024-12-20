import fs from 'fs'
import { supabase } from '../client'

export async function uploadImageToStorage(filePath: string, fileName: string) {
    try {
        // Читаем файл
        const fileBuffer = fs.readFileSync(filePath)
        // Загружаем в Supabase Storage
        const { data, error } = await supabase.storage
            .from('car-images')
            .upload(fileName, fileBuffer, {
                contentType: 'image/jpeg', // или 'image/webp' в зависимости от формата
                upsert: true, // перезаписывать если файл существует
            })
        if (error) {
            console.error('Ошибка загрузки файла:', error)
            return null
        }
        // Получаем публичный URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('car-images').getPublicUrl(data.path)
        return publicUrl
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error)
        return null
    }
}
