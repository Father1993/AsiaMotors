import {
    HomeIcon,
    ShoppingBagIcon,
    QuestionMarkCircleIcon,
    NewspaperIcon,
    Bars3Icon,
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
    { name: 'Блог', href: '/blog', icon: NewspaperIcon },
    { name: 'О компании', href: '/about', icon: QuestionMarkCircleIcon },
    { name: 'Меню', href: '#', icon: Bars3Icon, isMenu: true },
]

export const ModalMobileMenu = [
    { name: 'Как купить', href: '/how-to-buy' },
    { name: 'Наша команда', href: '/about#team' },
    { name: 'Отзывы', href: '/about#testimonials__section' },
    { name: 'Запчасти', href: '/spares' },
    { name: 'Вакансии', href: '/vacancies' },
    { name: 'Карточка предприятия', href: '/about#company-card' },
    { name: 'Контакты', href: '/contacts' },
]
