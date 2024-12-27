import CarPageClient from './CarPage.client'
import { Car } from '@/shared/types/adminTypes'

interface CarPageProps {
    car: Car
    allCars: Car[]
}

export default function CarPage({ car, allCars }: CarPageProps) {
    return <CarPageClient car={car} allCars={allCars} />
}
