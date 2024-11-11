import { Metadata } from 'next'
import Hero from '../components/sections/Hero/Hero'

// Метаданные для конкретной страницы
export const metadata: Metadata = {
    title: 'Главная | Perevozka27',
    description:
        'Главная страница компании Perevozka27 - грузоперевозки в Хабаровске',
}

export default function Home() {
    return <Hero />
}
