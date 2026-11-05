export const COMPANY_CLIENTS = 700
export const COMPANY_START_YEAR = 2022

export function companyExperience(now = new Date()) {
    const year = Number(new Intl.DateTimeFormat('en', {
        timeZone: 'Asia/Vladivostok', year: 'numeric',
    }).format(now))
    const years = Math.max(0, year - COMPANY_START_YEAR)
    const lastTwo = years % 100
    const word = lastTwo >= 11 && lastTwo <= 14 ? 'лет'
        : years % 10 === 1 ? 'год'
        : years % 10 >= 2 && years % 10 <= 4 ? 'года' : 'лет'
    return { years, label: `${word} на рынке` }
}
export type CompanyExperience = ReturnType<typeof companyExperience>
