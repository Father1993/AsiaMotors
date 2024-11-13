import {
    DocumentTextIcon,
    CreditCardIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    WrenchIcon,
    DocumentDuplicateIcon,
    BanknotesIcon,
    IdentificationIcon,
    FlagIcon,
} from '@heroicons/react/24/outline'

export const STEPS = [
    {
        id: 1,
        title: 'Заключение договора',
        description: 'Подписание договора на поиск и приобретение автомобиля',
        icon: DocumentTextIcon,
    },
    {
        id: 2,
        title: 'Внесение предоплаты',
        description: 'Внесение согласованной предоплаты для начала поиска',
        icon: CreditCardIcon,
    },
    {
        id: 3,
        title: 'Поиск автомобиля',
        description: 'Поиск автомобиля по вашим требованиям',
        icon: MagnifyingGlassIcon,
    },
    {
        id: 4,
        title: 'Согласование',
        description: 'Предоставление и согласование найденных вариантов',
        icon: CheckCircleIcon,
    },
    {
        id: 5,
        title: 'Проверка',
        description: 'Полная техническая проверка выбранного автомобиля',
        icon: WrenchIcon,
    },
    {
        id: 6,
        title: 'Основной договор',
        description: 'Заключение основного договора покупки',
        icon: DocumentDuplicateIcon,
    },
    {
        id: 7,
        title: 'Оплата',
        description: 'Внесение оставшейся суммы за автомобиль',
        icon: BanknotesIcon,
    },
    {
        id: 8,
        title: 'Таможенное оформление',
        description: 'Оформление документов и регистрация автомобиля',
        icon: IdentificationIcon,
    },
    {
        id: 9,
        title: 'Получение',
        description: 'Передача автомобиля, ключей и документов',
        icon: FlagIcon,
    },
]
