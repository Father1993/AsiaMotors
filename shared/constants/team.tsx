import { FaHandshake, FaCar } from 'react-icons/fa'
import { FaGlobe } from 'react-icons/fa'
import { FaShieldAlt } from 'react-icons/fa'

export const teamMembers = [
    {
        name: 'Андрей Чжан',
        role: 'Основатель',
        image: '/img/team/2.jpeg',
        description: 'Эксперт с 15-летним опытом международной автологистики',
    },
    {
        name: 'Анна Смирнова',
        role: 'Логистический директор',
        image: '/img/team/1.jpeg',
        description: 'Профессионал в организации международных автоперевозок',
    },
    {
        name: 'Михаил Иванов',
        role: 'Менеджер',
        image: '/img/team/3.jpeg',
        description: 'Специалист по подбору и техническому осмотру авто',
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
