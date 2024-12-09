import Link from 'next/link'
import { FaHandshake, FaCar, FaGlobe } from 'react-icons/fa'
import { FaShieldAlt } from 'react-icons/fa'
import { TeamMember } from '../types/offices'

export const advantagesList = [
    {
        icon: <FaGlobe className="text-red-500 w-12 h-12" />,
        title: 'Ваш прямой представитель в Китае',
        description:
            'Собственные офисы в Китае - никаких посредников и переплат',
    },
    {
        icon: <FaShieldAlt className="text-red-500 w-12 h-12" />,
        title: 'Гарантированное качество',
        description:
            'Тщательный отбор и проверка каждого автомобиля перед отправкой',
    },
    {
        icon: <FaHandshake className="text-red-500 w-12 h-12" />,
        title: 'Индивидуальный подход',
        description: 'Кастомизация под любые требования клиента',
    },
    {
        icon: <FaCar className="text-red-500 w-12 h-12" />,
        title: 'Эксклюзивные автомобили',
        description:
            'Возможность привезти авто до официального старта продаж в РФ',
    },
]

{
    /* Команда Хабаровск*/
}
export const teamMembersKhv = [
    {
        name: 'Андрей Чжан',
        role: 'Основатель',
        image: '/img/team/Andrey.png',
        description: 'Эксперт с 15-летним опытом международной автологистики',
    },
    {
        name: 'Михаил Ананьев',
        role: 'Ведущий эксперт по подбору автомобилей',
        image: '/img/team/Mihail.png',
        description: (
            <>
                Автоэксперт на портале{' '}
                <Link
                    href="https://www.dvhab.ru/"
                    className="text-blue-500 hover:text-blue-600 font-bold underline"
                >
                    DVHAB.RU
                </Link>
            </>
        ),
        telephone: (
            <>
                <Link href="tel:+79142142500" className="text-red-500">
                    +7 (914) 214-25-00
                </Link>
            </>
        ),
    },
    {
        name: 'Владимир Карпыш',
        role: 'Менеджер отдела продаж',
        image: '/img/team/Vladimir-man.png',
        description:
            'Реализовал более 100 успешных сделок. Эксперт по подбору автомобилей',
        telephone: (
            <>
                <Link href="tel:+79242066592" className="text-red-500">
                    +7 (924) 206-65-92
                </Link>
            </>
        ),
    },
    {
        name: 'Спиней Андрей',
        role: 'Разработка/Маркетинг',
        image: '/img/team/Andrej.webp',
        description:
            'Специализируется на комплексной веб-разработке и digital-маркетингу',
    },
]

{
    /* Команда Владивосток*/
}
export const teamMembersVdk = [
    {
        name: 'Роман Мориц',
        role: 'Руководитель филиала',
        image: '/img/team/vdk/man.jpg',
        description: 'Более 10 лет опыта в автомобильном бизнесе',
        address: 'Владивосток, ​Баляева улица, 49, офис- 50 - ​ЖК Горизонт',
        telephone: (
            <>
                <Link href="tel:+79996175664" className="text-red-500">
                    +7 (999) 617-56-64
                </Link>
            </>
        ),
    },
    {
        name: 'Кирил Зубченко',
        role: 'Старший менеджер по продажам',
        image: '/img/team/vdk/man2.jpg',
        description: 'Эксперт по работе с клиентами',
        address: 'Владивосток, ​Баляева улица, 49, офис- 50 - ​ЖК Горизонт',
        telephone: (
            <>
                <Link href="tel:+79143357069" className="text-red-500">
                    +7 (914) 335 70 69
                </Link>
            </>
        ),
    },
]

{
    /* Команда Харбин*/
}
export const teamMembersHarbin = [
    {
        name: 'Яша Юй',
        role: 'Директор китайского офиса',
        image: '/img/team/china/yasha.jpg',
        description: 'Специалист по работе с китайскими производителями',
        city: 'Хабрин',
        address:
            'No.1 Baoshui 3rd Road, Xingfu Town, Xiangfang District, Harbin',
        telephone: (
            <>
                <Link href="tel:+8613822140845" className="text-red-500">
                    +86-138-22-14-08-45
                </Link>
            </>
        ),
    },
    {
        name: 'Хе Чао',
        role: 'Технический инспектор',
        image: '/img/team/china/gus.jpg',
        description: 'Контроль качества и предпродажная подготовка',
        city: 'Суйфеньхэ',
        telephone: (
            <>
                <Link href="tel:+13804814499" className="text-red-500">
                    +86-138-048-144-99
                </Link>
            </>
        ),
    },
    {
        name: 'Юрий Би',
        role: 'Координатор поставок',
        image: '/img/team/china/yra.jpg',
        description: 'Организация логистики и таможенного оформления',
        city: 'Суйфеньхэ',
    },
]

{
    /* Команда Суйфэньхэ*/
}
export const teamMembersSuifenhe = [
    {
        name: 'Юрий Чау',
        role: 'Директор китайского офиса',
        image: '/img/team/china/sunvunxe_manager.jpg',
        description: 'Специалист по работе с китайскими производителями',
        city: 'Хабрин',
        address:
            'No.1 Baoshui 3rd Road, Xingfu Town, Xiangfang District, Harbin',
        telephone: (
            <>
                <Link href="tel:+8613822140845" className="text-red-500">
                    +86-138-22-14-08-45
                </Link>
            </>
        ),
    },
    {
        name: 'Ван Вэй',
        role: 'Технический инспектор',
        image: '/img/team/china/china-team.jpg',
        description: 'Контроль качества и предпродажная подготовка',
        city: 'Суйфеньхэ',
        telephone: (
            <>
                <Link href="tel:+13804814499" className="text-red-500">
                    +86-138-048-144-99
                </Link>
            </>
        ),
    },
    {
        name: 'Лю Ян',
        role: 'Координатор поставок',
        image: '/img/team/china/Image_20241128162415.jpg',
        description: 'Менеджер',
        city: 'Суйфеньхэ',
    },

    {
        name: 'Чжао Мин',
        role: 'Координатор поставок',
        image: '/img/team/china/Image_20241128162419.jpg',
        description: 'Поиск любого автомобиля в Китае',
        city: 'Суйфеньхэ',
    },
]

{
    /* Команда Камчатка*/
}
export const teamMembersKamch = [
    {
        name: 'Сергей Чжан',
        role: 'Руководитель филиала',
        image: '/img/team/kamch/sergey-kmch.jpg',
        description: 'Развитие бизнеса на Камчатке',
        address: 'Петропавловск-Камчатский, Тундровая, 1. СТО КАМ-МОТОРС',
        telephone: (
            <>
                <Link href="tel:+79619688888" className="text-red-500">
                    +7 (961) 968-88-88
                </Link>
            </>
        ),
    },
]

{
    /* Команда Сахалин*/
}
export const teamMembersSkh = [
    {
        name: 'Акуленко Евгений',
        role: 'Руководитель филиала',
        image: '/img/team/shl/shl2.jpg',
        description: 'Развитие бизнеса в регионах ДВ',
        address: 'Южно-Сахалинск,  ул. 3-я Новая 17',
        telephone: (
            <>
                <Link href="tel:+79625804006" className="text-red-500">
                    +7 (962) 580-40-06
                </Link>
            </>
        ),
    },
]

export const teamOffices = [
    { id: 'khv', name: 'Хабаровск', members: teamMembersKhv as TeamMember[] },
    { id: 'vdk', name: 'Владивосток', members: teamMembersVdk as TeamMember[] },
    {
        id: 'kamch',
        name: 'Петропавловск-Камчатский',
        members: teamMembersKamch as TeamMember[],
    },
    {
        id: 'skh',
        name: 'Южно-Сахалинск',
        members: teamMembersSkh as TeamMember[],
    },
    {
        id: 'Harbin',
        name: 'Харбин',
        members: teamMembersHarbin as TeamMember[],
    },
    {
        id: 'Suifenhe',
        name: 'Суйфэньхэ',
        members: teamMembersSuifenhe as TeamMember[],
    },
]
