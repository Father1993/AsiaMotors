import {
    TruckIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    DocumentCheckIcon,
} from '@heroicons/react/24/outline'

export const BENEFITS = [
    {
        id: 1,
        title: 'Официальные представительства',
        description:
            'Собственные офисы в России и Китае. Прямое сотрудничество с крупнейшими автосалонами Китая',
        icon: TruckIcon,
        color: 'blue',
    },
    {
        id: 2,
        title: 'Надёжные поставки',
        description:
            'Наши представители в Китае лично контролируют процесс отбора и отправки автомобилей. Гарантируем сохранность и своевременную доставку',
        icon: ShieldCheckIcon,
        color: 'blue',
    },
    {
        id: 3,
        title: 'Выгодные цены',
        description:
            'Благодаря прямым контрактам с производителями, предлагаем цены на 15-20% ниже рыночных',
        icon: CurrencyDollarIcon,
        color: 'blue',
    },
    {
        id: 4,
        title: 'Юридическая чистота',
        description:
            'Полное юридическое сопровождение сделки, все документы оформляются в соответствии с законодательством РФ',
        icon: DocumentCheckIcon,
        color: 'blue',
    },
]
