import { Metadata } from 'next'
import CustomsPage from '@/components/templates/ServicesPage/CustomsPage/CustomsPage'

export const metadata: Metadata = {
    title: 'Таможенное оформление автомобилей из Китая | Услуги таможенной очистки | AsiaMotors',
    description:
        'Таможенное оформление автомобилей из Китая. Мы гарантируем быструю и безопасную растаможку авто, помощь в оформлении всех необходимых документов и выгодные условия для клиентов.',
    keywords:
        'таможенное оформление автомобилей из Китая, растаможка авто, таможенная очистка автомобилей, услуги по растаможке, стоимость таможенного оформления',
    openGraph: {
        title: 'Таможенное оформление автомобилей из Китая | AsiaMotors',
        description:
            'Asia Motors предлагает полный спектр услуг по растаможке автомобилей из Китая. Профессиональная помощь в оформлении всех документов, гарантия надежности и минимальные сроки оформления.',
        type: 'website',
        url: 'https://asiamotors.su/customs',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 1200,
                height: 630,
                alt: 'Таможенная очистка AзиаМоторс',
            },
        ],
    },
}

export default function Clearance() {
    return <CustomsPage />
}
