import type { getDashboard } from '@/shared/lib/server/dashboard'
import { adminDate } from '@/shared/lib/admin-date'
import { ChartBarIcon } from '@heroicons/react/24/outline'

type Data = Awaited<ReturnType<typeof getDashboard>>
const dayKey = (value: string) =>
    new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Vladivostok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(value))
const dateLabel = (day: string) => adminDate(day + 'T00:00:00+10:00', true)

export function DashboardTrend({ data }: { data: Data }) {
    const last = dayKey(data.until)
    const first = data.since
        ? dayKey(data.since)
        : data.daily.at(-1)?.day || last
    const counts = new Map(data.daily.map(({ day, total }) => [day, total]))
    const days: { day: string; total: number }[] = []
    for (
        let time = Date.parse(first + 'T00:00:00Z');
        time <= Date.parse(last + 'T00:00:00Z');
        time += 86400000
    ) {
        const day = new Date(time).toISOString().slice(0, 10)
        days.push({ day, total: counts.get(day) || 0 })
    }
    // Keep narrow screens readable; each bar sums a consecutive calendar interval.
    const step = Math.max(1, Math.ceil(days.length / 30))
    const bars = []
    for (let i = 0; i < days.length; i += step) {
        const group = days.slice(i, i + step)
        bars.push({
            first: group[0].day,
            last: group.at(-1)!.day,
            total: group.reduce((sum, day) => sum + day.total, 0),
        })
    }
    const peak = Math.max(1, ...bars.map((bar) => bar.total))
    return (
        <section
            className="admin-panel dashboard-trend"
            aria-labelledby="dashboard-trend-title"
        >
            <div className="dashboard-section-heading">
                <div>
                    <h2 id="dashboard-trend-title">Поступление заявок</h2>
                    <p className="admin-muted">
                        {step === 1
                            ? 'Один столбец — один день.'
                            : `Один столбец — сумма за интервал до ${step} дней.`}{' '}
                        Даты Владивостока.
                    </p>
                </div>
                <ChartBarIcon aria-hidden="true" />
            </div>
            {data.requests.total ? (
                <>
                    <p className="dashboard-chart-scale">
                        Максимум за {step === 1 ? 'день' : 'интервал'}: {peak}
                    </p>
                    <div
                        className="dashboard-chart"
                        role="img"
                        aria-label={`Поступление заявок с ${dateLabel(first)} по ${dateLabel(last)}. Всего: ${data.requests.total}. Точные значения — в таблице ниже.`}
                    >
                        {bars.map((bar) => (
                            <div
                                key={bar.first}
                                className="dashboard-chart-column"
                                aria-hidden="true"
                                title={`${dateLabel(bar.first)}${bar.last !== bar.first ? ' — ' + dateLabel(bar.last) : ''}: ${bar.total}`}
                            >
                                <span
                                    style={{
                                        height: `${(bar.total / peak) * 100}%`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="dashboard-chart-axis" aria-hidden="true">
                        <span>{dateLabel(first)}</span>
                        <span>{dateLabel(last)}</span>
                    </div>
                    <details className="dashboard-day-details">
                        <summary>Значения по дням</summary>
                        <div className="dashboard-day-table" tabIndex={0} role="region" aria-label="Заявки по дням">
                            <table>
                                <caption className="sr-only">
                                    Заявки по дням, включая дни без заявок
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Дата</th>
                                        <th scope="col">Заявок</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {days.toReversed().map((day) => (
                                        <tr key={day.day}>
                                            <th scope="row">
                                                {dateLabel(day.day)}
                                            </th>
                                            <td>{day.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </>
            ) : (
                <div className="dashboard-empty">
                    <ChartBarIcon aria-hidden="true" />
                    <strong>За этот период заявок нет</strong>
                    <p>
                        Выберите другой период. Новые обращения с сайта появятся
                        здесь.
                    </p>
                </div>
            )}
        </section>
    )
}
