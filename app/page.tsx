import { Metadata } from 'next'
import Hero from '@/components/features/Hero/Hero'
import Slider from '@/components/features/Slider/Slider'
import SmartSearch from '@/components/features/SmartSearch/SmartSearch'
import Categories from '@/components/features/Categories/Categories'
import LatestNews from '@/components/features/LatestNews/LatestNews'
import Testimonials from '@/components/features/Testimonials/Testimonials'
import CTASection from '@/components/features/CTASection/CTASection'
import FAQ from '@/components/features/Faq/FAQ'
import BuyingProcess from '@/components/features/BuyingProcess/BuyingProcess'
import Benefits from '@/components/features/Benefits/Benefits'

export const metadata: Metadata = {
    title: 'AsiaMotors — Продажа новых и БУ автомобилей из Китая | Надежные авто напрямую от поставщиков',
    description:
        'AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса. Полное сопровождение сделки, выгодные условия и прямые поставки. Откройте для себя лучшие авто из Китая с AsiaMotors и получите качественный сервис на каждом этапе покупки. Узнайте больше!',
}

export default function Home() {
    return (
        <>
            <Hero />
            <SmartSearch />
            {/* Перемещаем наверх - важно дать пользователю быстрый доступ к поиску */}
            <Categories />
            {/* Показываем основные категории автомобилей сразу */}
            <Slider /> {/* Популярные модели после категорий */}
            <Benefits /> {/* Добавляем блок преимуществ */}
            <BuyingProcess /> {/* Добавляем процесс покупки */}
            <Testimonials /> {/* Социальное доказательство */}
            <LatestNews /> {/* Новости и обзоры */}
            <FAQ /> {/* Часто задаваемые вопросы */}
            <CTASection /> {/* Финальный призыв к действию */}
        </>
    )
}
