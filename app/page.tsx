import { Metadata } from 'next'
import Hero from '@/components/features/Hero/Hero'
import Slider from '@/components/features/Slider/Slider'
import SmartSearch from '@/components/features/SmartSearch/SmartSearch'
import Categories from '@/components/features/Categories/Categories'
import CTASection from '@/components/features/CTASection/CTASection'
import Benefits from '@/components/features/Benefits/Benefits'
import BuyingProcess from '@/components/features/BuyingProcess/BuyingProcess'
import Testimonials from '@/components/features/Testimonials/Testimonials'
import News from '@/components/features/News/News'
import FAQ from '@/components/features/Faq/FAQ'

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
            <Categories />
            <Slider />
            <Benefits />
            <BuyingProcess />
            <Testimonials />
            <News />
            <FAQ />
            <CTASection />
        </>
    )
}
