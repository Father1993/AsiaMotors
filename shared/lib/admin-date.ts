const formatter = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Vladivostok',
})
export function adminDate(value: string | null, dateOnly = false) {
    if (!value || !Number.isFinite(new Date(value).getTime())) return 'Не указано'
    return dateOnly
        ? new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeZone: 'Asia/Vladivostok' }).format(
              new Date(value),
          )
        : formatter.format(new Date(value))
}
