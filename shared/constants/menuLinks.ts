import {
    HomeIcon,
    ShoppingBagIcon,
    QuestionMarkCircleIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    // WrenchIcon,
} from '@heroicons/react/24/outline'

// Базовая навигация
export const NAVIGATION = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: 'Запчасти', href: '/spares' },
    { name: 'Как купить', href: '/how-to-buy' },
    { name: 'Блог', href: '/blog' },
    {
        name: 'О компании',
        href: '/about',
        submenu: [
            { name: 'О нас', href: '/about' },
            { name: 'Наша команда', href: '/about#team' },
            { name: 'Отзывы', href: '/about#testimonials__section' },
            { name: 'Карточка предприятия', href: '/about#company-card' },
            { name: 'Вакансии', href: '/vacancies' },
        ],
    },
    { name: 'Контакты', href: '/contacts' },
]

// Навигация с иконками для мобильного меню
export const MOBILE_NAVIGATION = [
    { name: 'Главная', href: '/', icon: HomeIcon },
    { name: 'Каталог', href: '/catalog', icon: ShoppingBagIcon },
    // { name: 'Запчасти', href: '/spares', icon: WrenchIcon },
    { name: 'Как купить', href: '/how-to-buy', icon: QuestionMarkCircleIcon },
    { name: 'Блог', href: '/blog', icon: BuildingOfficeIcon },
    { name: 'Контакты', href: '/contacts', icon: PhoneIcon },
]
