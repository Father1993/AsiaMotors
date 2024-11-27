import { Metadata } from 'next'
import DeliveryPage from '@/components/templates/DeliveryPage/DeliveryPage'

export const metadata: Metadata = {
    title: 'Доставка автомобилей из Китая в Россию | Цены и сроки | AsiaMotors',
    description:
        'Профессиональная доставка авто из Китая под ключ от 7 дней. ✅ Полное таможенное оформление ✅ Гарантия сохранности ✅ Выгодные цены от 80000₽. Бесплатная консультация!',
    keywords:
        'доставка авто из китая, растаможка авто из китая, перевозка автомобилей из китая, стоимость доставки авто из китая, сроки доставки авто из китая',
    openGraph: {
        title: 'Доставка автомобилей из Китая в Россию | AsiaMotors',
        description:
            'Быстрая и надежная доставка авто из Китая под ключ. Таможенное оформление включено. Гарантия лучшей цены. Узнайте стоимость прямо сейчас!',
        type: 'website',
        url: 'https://asiamotors.su/delivery',
        images: [
            {
                url: '/img/china-cars-import.jpg',
                width: 1200,
                height: 630,
                alt: 'Процесс импорта автомобилей из Китая',
            },
        ],
    },
}

export default function Delivery() {
    return <DeliveryPage />
}
