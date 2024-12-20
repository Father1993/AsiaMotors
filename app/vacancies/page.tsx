/* eslint-disable max-len */
import { Metadata } from 'next'
import VacanciesPage from '@/components/templates/VacanciesPage/VacanciesPage'

export const metadata: Metadata = {
    title: 'Вакансии в AsiaMotors | Работа в автомобильной компании',
    description:
        'Актуальные вакансии в компании AsiaMotors. Присоединяйтесь к команде профессионалов в сфере продаж и обслуживания китайских автомобилей. Конкурентная зарплата, официальное трудоустройство, карьерный рост.',
    openGraph: {
        title: 'Вакансии в AsiaMotors | Работа в автомобильной компании',
        description:
            'Актуальные вакансии в компании AsiaMotors. Присоединяйтесь к команде профессионалов в сфере продаж и обслуживания китайских автомобилей. Конкурентная зарплата, официальное трудоустройство, карьерный рост.',
        type: 'website',
        url: 'https://asiamotors.su/vacancies',
        images: [
            {
                url: '/img/android-chrome-192x192.png',
                width: 192,
                height: 192,
                alt: 'Карьера в AsiaMotors - официальном дилере китайских автомобилей',
            },
        ],
        siteName: 'AsiaMotors',
        locale: 'ru_RU',
    },
    twitter: {
        card: 'summary',
        title: 'Вакансии AsiaMotors | Построй карьеру в автобизнесе',
        description:
            'Открытые вакансии в компании AsiaMotors. Работа в динамично развивающейся компании по продаже и обслуживанию китайских автомобилей.',
        images: '/img/android-chrome-192x192.png',
    },
    icons: {
        icon: '/img/android-chrome-192x192.png',
        apple: '/img/apple-touch-icon.png',
    },
    alternates: {
        canonical: 'https://asiamotors.su/vacancies',
    },
    keywords:
        'вакансии asiamotors, работа в автосалоне, карьера в автобизнесе, азиямоторс, работа с китайскими автомобилями, вакансии автодилера, работа в автобизнесе, работа с китайскими авто, карьера в автомобильной сфере, вакансии менеджера по продажам авто, вакансии в автоцентре, трудоустройство в автобизнесе, вакансии продажа автомобилей, работа в автосалоне менеджер, вакансии в автомобильной компании, работа в автоцентре, карьера в продажах автомобилей, работа в дилерском центре, вакансии автосалон Москва, вакансии автосалон регионы, работа в китайских автосалонах, вакансии технического специалиста в автосалоне, работа с автомобилями, вакансии автодилер китайских брендов, работа в автосалоне официального дилера, карьера в продажах автомобилей премиум-класса, вакансии в автобизнесе для начинающих, работа менеджер автосалон, работа в автобизнесе с опытом, блогер, smm, менеджер, Владивосток, Хабаровск',
}

export default function BlogPages() {
    return <VacanciesPage />
}
