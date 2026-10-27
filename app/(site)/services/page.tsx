import ServicesPage from '@/components/templates/ServicesPage/ServicesPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Услуги компании Asia Motors | Доставка и продажа автомобилей из Китая',
    description:
        'Asia Motors предоставляет услуги по доставке новых и подержанных автомобилей из Китая, включая доставку, таможенное оформление и страхование. Узнайте о лучших предложениях и гарантированной надежности автомобилей по доступным ценам',
    keywords:
        'доставка автомобилей из Китая, продажа авто из Китая, таможенное оформление автомобилей, новые автомобили из Китая, подержанные автомобили, страхование автомобилей, запчасти для авто из Китая',
    openGraph: {
        title: 'Услуги компании Asia Motors | Авто из Китая',
        description:
            'Asia Motors предлагает полный спектр услуг по доставке и продаже автомобилей из Китая. Мы занимаемся таможенным оформлением, страхованием, а также поставляем запчасти для авто. Получите консультацию и лучшие предложения!',
        type: 'website',
        url: 'https://asiamotors.su/services',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 1200,
                height: 630,
                alt: 'Импорт автомобилей из Китая Азиямоторс',
            },
        ],
    },
}

export default function Services() {
    return <ServicesPage />
}
