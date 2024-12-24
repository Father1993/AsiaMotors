import { supabase } from '../client'

export async function uploadImageToStorage(file: File) {
    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`

        const { data, error } = await supabase.storage
            .from('car-images')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false,
            })

        if (error) {
            console.error('Ошибка загрузки файла:', error)
            return null
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from('car-images').getPublicUrl(data.path)

        return publicUrl
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error)
        return null
    }
}

export async function deleteImageFromStorage(fileName: string) {
    try {
        const { error } = await supabase.storage
            .from('car-images')
            .remove([fileName])

        if (error) {
            console.error('Ошибка удаления файла:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Ошибка при удалении изображения:', error)
        return false
    }
}
