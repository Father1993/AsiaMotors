import { Offices } from '../types/offices'

export const offices: Offices = {
    khabarovsk: {
        city: 'Хабаровск',
        address: 'ул. Зеленая 3-А, офис 215',
        phone: '+7 (4212) 93-55-55',
        email: 'asiamotors27@mail.ru',
        workHours: 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00',
        image: '/img/office/khv.jpg',
        mapComponent: 'khv',
    },
    vladivostok: {
        city: 'Владивосток',
        address: 'ул. Светланская 89, офис 308',
        phone: '+7 (423) 255-55-55',
        email: 'asiamotors25@mail.ru',
        workHours: 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00',
        image: '/img/office/vdk.jpg',
        mapComponent: 'vdk',
    },
}
