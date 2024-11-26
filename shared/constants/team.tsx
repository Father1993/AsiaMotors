import Link from 'next/link'
import { FaHandshake, FaCar } from 'react-icons/fa'
import { FaGlobe } from 'react-icons/fa'
import { FaShieldAlt } from 'react-icons/fa'

export const advantagesList = [
    {
        icon: <FaShieldAlt className="text-red-500 w-12 h-12" />,
        title: 'Гарантированное качество',
        description:
            'Тщательный отбор и проверка каждого автомобиля перед отправкой',
    },
    {
        icon: <FaGlobe className="text-red-500 w-12 h-12" />,
        description:
            'Собственные офисы в Китае - никаких посредников и переплат',
    },
    {
        icon: <FaCar className="text-red-500 w-12 h-12" />,
        title: 'Эксклюзивные автомобили',
        description:
            'Возможность привезти авто до официального старта продаж в РФ',
    },
    {
        icon: <FaHandshake className="text-red-500 w-12 h-12" />,
        title: 'Индивидуальный подход',
        description: 'Кастомизация под любые требования клиента',
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
    },
    {
        name: 'Владимир Карпыш',
        role: 'Менеджер отдела продаж',
        image: '/img/team/Vladimir-man.png',
        description: 'Профессионал, находящий решения для каждого клиента',
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
        name: 'Сергей Иванов',
        role: 'Руководитель филиала',
        image: '/img/team/vdk/vdk1.webp',
        description: 'Более 10 лет опыта в автомобильном бизнесе',
    },
    {
        name: 'Екатерина Петрова',
        role: 'Старший менеджер по продажам',
        image: '/img/team/vdk/vdk2.jpeg',
        description: 'Эксперт по работе с корпоративными клиентами',
    },
    {
        name: 'Алексей Смирнов',
        role: 'Специалист по логистике',
        image: '/img/team/vdk/vdk3.webp',
        description: 'Организация поставок автомобилей из Азии',
    },
]

{
    /* Команда Китай*/
}
export const teamMembersChina = [
    {
        name: 'Ли Вэй',
        role: 'Директор китайского офиса',
        image: '/img/team/china/1.jpg',
        description: 'Специалист по работе с китайскими производителями',
    },
    {
        name: 'Чжан Мин',
        role: 'Технический инспектор',
        image: '/img/team/china/2.png',
        description: 'Контроль качества и предпродажная подготовка',
    },
    {
        name: 'Ван Хуа',
        role: 'Координатор поставок',
        image: '/img/team/china/3.jpeg',
        description: 'Организация логистики и таможенного оформления',
    },
]

{
    /* Команда Китай*/
}
export const teamMembersKamch = [
    {
        name: 'Сергей Чжан',
        role: 'Региональный менеджер',
        image: '/img/team/kamch/2.jpg',

        description: 'Развитие бизнеса на Камчатке',
        telephone: '+7 (961) 968-88-88',
        address: 'Петропавловск-Камчатский, Тундровая, 1',
    },
]

{
    /* Команда Китай*/
}
export const teamMembersSkh = [
    {
        name: 'Акуленко Евгений Константинович',
        role: 'Региональный менеджер',
        image: '/img/team/shl/shl2.jpg',
        description: 'Развитие бизнеса в регионах ДВ',
        telephone: '+7 (962) 580-40-06',
        address: 'Южно-Сахалинск,  ул. 3-я Новая 17',
    },
]

export const teamOffices = [
    { id: 'khv', name: 'Хабаровск', members: teamMembersKhv },
    { id: 'vdk', name: 'Владивосток', members: teamMembersVdk },
    { id: 'china', name: 'Харбин', members: teamMembersChina },
    {
        id: 'kamch',
        name: 'Петропавловск-Камчатский',
        members: teamMembersKamch,
    },
    { id: 'skh', name: 'Южно-Сахалинск', members: teamMembersSkh },
]
