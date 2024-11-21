import { FiCheckCircle } from 'react-icons/fi'
import { TbEngine } from 'react-icons/tb'

export const sparesCategories = [
    {
        id: 1,
        name: 'Двигатель',
        icon: (
            <TbEngine
                size={37}
                className="text-2xl mx-auto flex items-center justify-center"
            />
        ),
    },
    { id: 2, name: 'Трансмиссия', icon: '🔄' },
    { id: 3, name: 'Подвеска', icon: '🔧' },
    { id: 4, name: 'Тормозная система', icon: '🛑' },
    { id: 5, name: 'Кузовные детали', icon: '🚗' },
    { id: 6, name: 'Электрика', icon: '⚡' },
]

export const sparesBenefits = [
    {
        title: 'Оригинальные запчасти',
        description: 'Прямые поставки от производителей',
        icon: (
            <FiCheckCircle
                size={40}
                className="text-3xl text-green-500 mx-auto flex items-center justify-center"
            />
        ),
    },
    {
        title: 'Быстрая доставка',
        description: 'от 2х недель',
        icon: '🚚',
    },
    {
        title: 'Гарантия качества',
        description: '100% гарантия на все детали',
        icon: '🛡️',
    },
]

export const sparesAdvantages = [
    {
        title: 'Прямые поставки из Китая',
        description:
            'Работаем напрямую с производителями и крупнейшими поставщиками в Китае',
        icon: '🏭',
        details: 'Минуя посредников, мы предлагаем лучшие цены на рынке',
    },
    {
        title: 'Ремонт в Китае',
        description: 'Организуем ремонт вашего автомобиля в Китае',
        icon: '🔧',
        details: 'Экономия до 70% по сравнению с ремонтом в России',
    },
    {
        title: 'Любые запчасти',
        description: 'Найдем любую деталь для китайских и других автомобилей',
        icon: '🚗',
        details: 'Работаем со всеми марками и моделями',
    },
]
