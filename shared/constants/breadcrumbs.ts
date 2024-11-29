import { BreadcrumbItem } from '../types/breadcrumbs'

export const BLOG_BREADCRUMBS: BreadcrumbItem[] = [
    { label: 'Блог', href: '/blog' },
]

export const ABOUT_BREADCRUMBS: BreadcrumbItem[] = [
    { label: 'О компании', href: '/about' },
]

export const HOW_TO_BUY_BREADCRUMBS: BreadcrumbItem[] = [
    { label: 'Как купить', href: '/how-to-buy' },
]

export const CATALOG: BreadcrumbItem[] = [
    { label: 'Каталог', href: '/catalog' },
]

export const CONTACTS: BreadcrumbItem[] = [
    { label: 'Контакты', href: '/contacts' },
]

export const VACANCIES: BreadcrumbItem[] = [
    { label: 'Вакансии', href: '/vacancies' },
]

export const FAQ: BreadcrumbItem[] = [{ label: 'FAQ', href: '/faq' }]

export const SPARES: BreadcrumbItem[] = [{ label: 'Запчасти', href: '/spares' }]

const servicesLink = {
    label: 'Услуги',
    href: '/services',
}

export const SERVICES: BreadcrumbItem[] = [
    { label: 'Услуги', href: '/services' },
]
export const DELIVERY_BREADCRUMBS: BreadcrumbItem[] = [
    servicesLink,
    { label: 'Доставка', href: '/delivery' },
]
export const INSURANCE: BreadcrumbItem[] = [
    servicesLink,
    { label: 'Страхование', href: '/insurance' },
]

export const CUSTOMS: BreadcrumbItem[] = [
    servicesLink,
    { label: 'Таможенное оформление', href: '/customs' },
]

export const NEW_CARS: BreadcrumbItem[] = [
    servicesLink,
    { label: 'Новые автомобили из Китая', href: '/customs' },
]

export const USED_CARS: BreadcrumbItem[] = [
    servicesLink,
    { label: 'Автомобили с пробегом', href: '/customs' },
]
