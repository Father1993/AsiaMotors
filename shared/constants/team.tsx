import Link from 'next/link'
import { FaHandshake, FaCar } from 'react-icons/fa'
import { FaGlobe } from 'react-icons/fa'
import { FaShieldAlt } from 'react-icons/fa'

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
]

export const advantagesList = [
    {
        icon: <FaShieldAlt className="text-red-500 w-12 h-12" />,
        title: 'Гарантированное качество',
        description:
            'Тщательный отбор и проверка каждого автомобиля перед отправкой',
    },
    {
        icon: <FaGlobe className="text-red-500 w-12 h-12" />,
        title: 'Прямые поставки из Китая',
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
