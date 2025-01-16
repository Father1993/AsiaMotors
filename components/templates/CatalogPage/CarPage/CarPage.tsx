import { CarPageProps } from '@/shared/types/catalog'
import CarPageClient from './CarPage.client'

export default function CarPage({ car, allCars }: CarPageProps) {
    return <CarPageClient car={car} allCars={allCars} />
}
