import { CarPageProps } from '@/shared/types/carPage'
import CarPageClient from './CarPage.client'

export default function CarPage({ car }: CarPageProps) {
    return <CarPageClient car={car} />
}
