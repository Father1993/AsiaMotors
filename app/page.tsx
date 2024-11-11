import { Metadata } from 'next'
import Hero from '@/components/features/Hero/Hero'

// Метаданные для конкретной страницы
export const metadata: Metadata = {
    title: 'Главная | AsiaMotors',
    description: 'Главная страница компании AsiaMotors',
}

export default function Home() {
    return <Hero />
}
