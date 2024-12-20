import { NextResponse } from 'next/server'
import { migrateData } from '@/shared/lib/superbase/utils/migration'

export async function POST() {
    try {
        await migrateData()
        return NextResponse.json({ message: 'Миграция успешно завершена' })
    } catch (error) {
        console.error('Ошибка миграции:', error)
        return NextResponse.json(
            { error: 'Ошибка при выполнении миграции' },
            { status: 500 }
        )
    }
}
