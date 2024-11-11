import {
    HomeIcon,
    ShoppingBagIcon,
    QuestionMarkCircleIcon,
    BuildingOfficeIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline'

// Базовая навигация
export const NAVIGATION = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: 'Как купить', href: '/how-to-buy' },
    { name: 'Блог', href: '/contacts' },
    { name: 'О компании', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
]

// Навигация с иконками для мобильного меню
export const MOBILE_NAVIGATION = [
    { name: 'Главная', href: '/', icon: HomeIcon },
    { name: 'Каталог', href: '/catalog', icon: ShoppingBagIcon },
    { name: 'Как купить', href: '/how-to-buy', icon: QuestionMarkCircleIcon },
    { name: 'О компании', href: '/about', icon: BuildingOfficeIcon },
    { name: 'Контакты', href: '/contacts', icon: PhoneIcon },
]
