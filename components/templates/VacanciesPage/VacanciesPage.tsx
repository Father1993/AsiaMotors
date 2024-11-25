import Image from 'next/image'
import Link from 'next/link'

const VacanciesPage = () => {
    const experience = [
        'Опыт создания креативного контента',
        'Грамотная речь и хорошая дикция',
        'Базовые знания китайского языка будут преимуществом',
        'Готовность к командировкам',
        'Наличие загранпаспорта',
        'Высокая ответственность и пунктуальность',
    ]
    const conditions = [
        { label: 'Занятость', value: 'Полная' },
        { label: 'Режим работы', value: 'Фиксированный' },
        { label: 'Опыт работы', value: 'Без опыта' },
        { label: 'Для кандидатов', value: 'Для студентов' },
        {
            label: 'Сфера деятельности',
            value: 'Продажа и обслуживание автомобилей',
        },
        { label: 'Образование', value: 'Не имеет значения' },
        { label: 'Формат работы', value: 'В офисе или на объекте' },
    ]
    const possibilities = [
        'Возможность создавать уникальный контент для международной аудитории',
        'Работа с премиальными автомобилями',
        'Поездки в Китай (командировки)',
        'Достойную заработную плату (при собеседовании)',
    ]
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero секция */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Присоединяйтесь к команде AзиаМоторс
                </h1>
                <p className="text-xl text-gray-600">
                    Создавайте будущее автомобильной индустрии вместе с нами
                </p>
            </div>
            {/* Карточка вакансии */}
            <div className="group relative isolate rounded-2xl shadow-xl mb-8 overflow-hidden">
                {/* Фоновое изображение */}
                <Image
                    src="/img/vacancies.jpg"
                    alt="Китайский автосалон в России"
                    fill
                    className="object-cover object-center -z-10"
                    priority
                    quality={75}
                />

                {/* Градиентный оверлей */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/55 to-white/75 backdrop-blur-[5px] transition-all duration-300 group-hover:backdrop-blur-[4px] group-hover:bg-white/85" />
                {/* Основной контент */}
                <div className="relative z-10 p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Контент-мейкер
                    </h2>
                    {/* Условия работы */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Условия
                            </h3>
                            <ul className="space-y-3">
                                {conditions.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="font-medium text-gray-700 min-w-[180px]">
                                            {item.label}:
                                        </span>
                                        <span className="text-gray-600">
                                            {item.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Описание компании */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-white/70">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                О компании
                            </h3>
                            <p className="text-gray-600">
                                АзиаМоторс - динамично развивающаяся компания,
                                занимающаяся экспортом автомобилей из Китая
                            </p>
                            <br />
                            <Link className="text-red-500" href="/about">
                                <u>Более подробнее</u>
                            </Link>
                        </div>
                    </div>
                    {/* Что предлагаем и ожидаем */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Что мы предлагаем
                            </h3>
                            <ul className="space-y-3">
                                {possibilities.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="text-emerald-500 mr-2">
                                            •
                                        </span>
                                        <span className="text-gray-600">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Что мы ожидаем
                            </h3>
                            <ul className="space-y-3">
                                {experience.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="text-emerald-500 mr-2">
                                            •
                                        </span>
                                        <span className="text-gray-600">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Кнопка отклика */}
                    <div className="mt-8 text-center">
                        <a
                            href="tel:+79294156555"
                            className="inline-flex items-center justify-center bg-[#2F3136] hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                            Откликнуться на вакансию
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default VacanciesPage
