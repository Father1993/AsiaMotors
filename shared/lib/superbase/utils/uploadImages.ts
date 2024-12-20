import fs from 'fs'
import { supabase } from '../client'

export async function uploadImage(filePath: string, fileName: string) {
    try {
        const file = fs.readFileSync(filePath)
        const { error } = await supabase.storage
            .from('car-images')
            .upload(fileName, file)

        if (error) {
            console.error('Ошибка загрузки файла:', error)
            return null
        }

        const { data } = supabase.storage
            .from('car-images')
            .getPublicUrl(fileName)

        return data.publicUrl
    } catch (error) {
        console.error('Ошибка чтения файла:', error)
        return null
    }
}
