import DeliveryPage from '@/components/templates/ServicesPage/DeliveryPage/DeliveryPage'
import { Metadata } from 'next'

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
        url: 'https://asiamotors.su/services/delivery',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 1200,
                height: 630,
                alt: 'Заказать автомобилей из Китая Азиямоторс',
            },
        ],
    },
}

export default function Delivery() {
    return <DeliveryPage />
}
