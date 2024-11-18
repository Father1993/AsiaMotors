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
            name: 'Haval H6',
            category: 'Кроссоверы',
            price: '2 890 000 ₽',
            image: '/img/cars/haval-h6.jpg',
            specs: ['2.0L', '150 л.с.', 'АКПП'],
            available: true,
        },
    ],
    japan: [
        {
            id: 1,
            name: 'Toyota Camry',
            category: 'Седаны',
            price: '3 890 000 ₽',
            image: '/img/cars/toyota-camry.jpg',
            specs: ['2.5L', '200 л.с.', 'АКПП'],
            available: true,
        },
    ],
    korea: [
        {
            id: 1,
            name: 'Hyundai Tucson',
            category: 'Кроссоверы',
            price: '3 290 000 ₽',
            image: '/img/cars/hyundai-tucson.jpg',
            specs: ['2.0L', '180 л.с.', 'АКПП'],
            available: true,
        },
    ],
}
