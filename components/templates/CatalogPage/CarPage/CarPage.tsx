import News from '@/components/features/News/News'
import { CarPageProps } from '@/shared/types/catalog'
import CarPageClient from './CarPage.client'

export default function CarPage({ car, allCars }: CarPageProps) {
    return <CarPageClient car={car} allCars={allCars} news={<News />} />
}
