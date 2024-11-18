import { FiSettings, FiZap, FiBox } from 'react-icons/fi'
import { CarsDataType, Country } from '../types/catalog'

export const countries: Country[] = [
    { id: 'china', name: 'Китай' },
    { id: 'japan', name: 'Япония' },
    { id: 'korea', name: 'Корея' },
]

export const categories = [
    'Все',
    'Кроссоверы',
    'Седаны',
    'Электромобили',
    'Минивэны',
]

export const priceRanges = [
    'Все цены',
    'До 2 млн',
    '2-3 млн',
    '3-4 млн',
    'От 4 млн',
]

export const carsData: CarsDataType = {
    china: [
        {
            id: 1,
            brand: 'Haval',
            name: 'H6',
            category: 'Кроссоверы',
            price: '2 890 000 ₽',
            image: '/img/cars/catalog/china/haval_h6_new_gen_5_1000.jpg',
            specs: [
                { icon: <FiSettings />, value: '2.0L' },
                { icon: <FiZap />, value: '150 л.с.' },
                { icon: <FiBox />, value: 'АКПП' },
            ],
            available: true,
        },
        {
            id: 2,
            brand: 'TANK',
            name: '300',
            category: 'Кроссоверы',
            price: '2 890 000 ₽',
            image: '/img/cars/catalog/china/tank500.jpeg',
            specs: [
                { icon: <FiSettings />, value: '2.0L' },
                { icon: <FiZap />, value: '150 л.с.' },
                { icon: <FiBox />, value: 'АКПП' },
            ],
            available: true,
        },
    ],
    japan: [
        {
            id: 1,
            brand: 'Toyota',
            name: 'Camry',
            category: 'Седаны',
            price: '3 890 000 ₽',
            image: '/img/cars/catalog/japan/camry.jpg',
            specs: [
                { icon: <FiSettings />, value: '2.5L' },
                { icon: <FiZap />, value: '200 л.с.' },
                { icon: <FiBox />, value: 'АКПП' },
            ],
            available: true,
        },
    ],
    korea: [
        {
            id: 1,
            brand: 'Hyundai',
            name: 'Tucson',
            category: 'Кроссоверы',
            price: '3 290 000 ₽',
            image: '/img/cars/catalog/korea/tucson.jpeg',
            specs: [
                { icon: <FiSettings />, value: '2.0L' },
                { icon: <FiZap />, value: '180 л.с.' },
                { icon: <FiBox />, value: 'АКПП' },
            ],
            available: true,
        },
    ],
}
