import Link from 'next/link'
import {
    ArrowRightIcon,
    InboxIcon,
    TruckIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PlusIcon,
} from '@heroicons/react/24/outline'
import { requireAdmin } from '@/shared/lib/server/http'
import { getDashboard } from '@/shared/lib/server/dashboard'
import { adminDate } from '@/shared/lib/admin-date'
import { DashboardRefresh } from '@/components/admin/DashboardRefresh'
import { DashboardTrend } from '@/components/admin/DashboardTrend'
import './dashboard.css'

export const metadata = { title: 'Обзор работы | AsiaMotors' }
const periods = [
    ['7', '7 дней'],
    ['30', '30 дней'],
    ['90', '90 дней'],
    ['all', 'Все сохранённые'],
] as const

export default async function Dashboard({
    searchParams,
}: {
    searchParams: Promise<{ period?: string }>
}) {
    await requireAdmin()
    const { period } = await searchParams
    const data = await getDashboard(
        typeof period === 'string' ? period : undefined,
    )
    const mailError = data.backlog.failed > 0
    const inventory = [
        {
            title: 'Автомобили',
            icon: TruckIcon,
            total: data.cars.total,
            href: '/admin',
            action: 'Добавить автомобиль',
            create: '/admin/cars/new',
            hint: 'Состояние каталога сейчас',
            rows: [
                [
                    'Опубликовано',
                    data.cars.published,
                    '/admin?status=published',
                ],
                [
                    'В наличии',
                    data.cars.inStock,
                    '/admin?status=published&availability=in_stock',
                ],
                [
                    'В наличии в Китае',
                    data.cars.inChina,
                    '/admin?status=published&availability=in_china',
                ],
                [
                    'Под заказ',
                    data.cars.onOrder,
                    '/admin?status=published&availability=on_order',
                ],
                ['Черновики', data.cars.draft, '/admin?status=draft'],
                ['Скрытые', data.cars.hidden, '/admin?status=hidden'],
            ] as const,
        },
        {
            title: 'Статьи',
            icon: DocumentTextIcon,
            total: data.articles.total + data.articles.archive,
            href: '/admin/blog',
            action: 'Создать статью',
            create: '/admin/blog/new',
            hint: 'Новые материалы и сохранённый архив',
            rows: [
                [
                    'Опубликованные новые',
                    data.articles.published,
                    '/admin/blog?source=new&status=published',
                ],
                [
                    'Черновики',
                    data.articles.draft,
                    '/admin/blog?source=new&status=draft',
                ],
                [
                    'Скрытые',
                    data.articles.hidden,
                    '/admin/blog?source=new&status=hidden',
                ],
                [
                    'Запланировано',
                    data.articles.scheduled,
                    '/admin/blog?source=new&status=scheduled',
                ],
                [
                    'Архивные',
                    data.articles.archive,
                    '/admin/blog?source=archive',
                ],
            ] as const,
        },
    ]
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">
                        AsiaMotors · рабочее пространство
                    </p>
                    <h1>Обзор работы</h1>
                    <p className="admin-muted">
                        Главное о заявках, каталоге и публикациях — в одном
                        месте.
                    </p>
                </div>
                <div className="dashboard-header-actions">
                    <span className="dashboard-updated">
                        Обновлено {adminDate(data.until)}
                        <br />
                        Владивосток (UTC+10)
                    </span>
                    <DashboardRefresh />
                </div>
            </header>

            <section
                className="admin-panel dashboard-priority"
                aria-labelledby="dashboard-backlog"
            >
                <div className="dashboard-priority-main">
                    <span className="dashboard-section-icon">
                        <InboxIcon aria-hidden="true" />
                    </span>
                    <div>
                        <h2 id="dashboard-backlog">Требуют внимания сейчас</h2>
                        <p className="admin-muted">
                            Все сохранённые заявки, независимо от периода ниже.
                        </p>
                    </div>
                    <Link
                        href="/admin/requests?status=new"
                        className="dashboard-new"
                        aria-label={`Новые заявки: ${data.backlog.new}`}
                    >
                        <strong>{data.backlog.new}</strong>
                        <span>Новые заявки</span>
                    </Link>
                    <Link
                        href={
                            data.backlog.new
                                ? '/admin/requests?status=new'
                                : '/admin/requests'
                        }
                        className="admin-button admin-button-primary"
                    >
                        {data.backlog.new
                            ? 'Разобрать заявки'
                            : 'Открыть заявки'}
                        <ArrowRightIcon aria-hidden="true" />
                    </Link>
                </div>
                <div className="dashboard-queue">
                    {(
                        [
                            [
                                'Заявки в работе',
                                data.backlog.processing,
                                '/admin/requests?status=processing',
                            ],
                            [
                                'Письма в очереди',
                                data.backlog.pending,
                                '/admin/requests?mail=pending',
                            ],
                            [
                                'Ошибки почты',
                                data.backlog.failed,
                                '/admin/requests?mail=failed',
                            ],
                        ] as const
                    ).map(([label, value, href]) => (
                        <Link
                            href={href}
                            key={label}
                            className={
                                label === 'Ошибки почты' && value > 0
                                    ? 'dashboard-danger'
                                    : ''
                            }
                        >
                            <span>{label}</span>
                            <strong>{value}</strong>
                            <ArrowRightIcon aria-hidden="true" />
                        </Link>
                    ))}
                </div>
            </section>

            <section
                className="dashboard-analytics"
                aria-labelledby="dashboard-leads"
            >
                <div className="dashboard-analytics-heading">
                    <div>
                        <h2 id="dashboard-leads">Заявки за выбранный период</h2>
                        <p className="admin-muted">
                            {data.since
                                ? adminDate(data.since, true) + ' — '
                                : 'Все сохранённые по '}
                            {adminDate(data.until, true)}
                        </p>
                    </div>
                    <nav
                        className="dashboard-period"
                        aria-label="Период заявок"
                    >
                        {periods.map(([value, label]) => (
                            <Link
                                key={value}
                                href={'/admin/dashboard?period=' + value}
                                aria-current={
                                    data.period === value ? 'page' : undefined
                                }
                                scroll={false}
                                prefetch={false}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="dashboard-metrics">
                    {(
                        [
                            [
                                'Всего заявок',
                                data.requests.total,
                                '/admin/requests',
                            ],
                            [
                                'Новые',
                                data.requests.new,
                                '/admin/requests?status=new',
                            ],
                            [
                                'В работе',
                                data.requests.processing,
                                '/admin/requests?status=processing',
                            ],
                            [
                                'Закрытые',
                                data.requests.closed,
                                '/admin/requests?status=closed',
                            ],
                        ] as const
                    ).map(([label, value, href]) => (
                        <Link
                            href={href}
                            key={label}
                            className="admin-panel dashboard-metric"
                        >
                            <span>
                                {label}
                                <ArrowRightIcon aria-hidden="true" />
                            </span>
                            <strong>{value}</strong>
                        </Link>
                    ))}
                </div>
                <p className="dashboard-caption">
                    Считаем по дате получения, показываем текущий статус.
                    Переходы открывают полные рабочие списки без ограничения
                    периода.
                </p>
                <div className="dashboard-analysis-grid">
                    <DashboardTrend data={data} />
                    <section
                        className="admin-panel dashboard-sources"
                        aria-labelledby="dashboard-sources-title"
                    >
                        <div className="dashboard-section-heading">
                            <div>
                                <h2 id="dashboard-sources-title">
                                    Откуда приходят заявки
                                </h2>
                                <p className="admin-muted">
                                    Формы сайта за выбранный период
                                </p>
                            </div>
                        </div>
                        {data.sources.length ? (
                            <ul>
                                {data.sources.map((source) => (
                                    <li key={source.source}>
                                        <div>
                                            <span>
                                                {source.source ||
                                                    'Форма не указана'}
                                            </span>
                                            <strong>{source.total}</strong>
                                        </div>
                                        <div
                                            className="dashboard-source-track"
                                            aria-hidden="true"
                                        >
                                            <span
                                                style={{
                                                    width: `${data.requests.total ? (source.total / data.requests.total) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="dashboard-empty">
                                <InboxIcon aria-hidden="true" />
                                <strong>Источников пока нет</strong>
                                <p>
                                    Здесь будет видно, какие формы приводят
                                    обращения.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </section>

            <section
                className="admin-panel dashboard-mail"
                aria-labelledby="dashboard-mail-title"
            >
                <div className="dashboard-section-heading">
                    <span className="dashboard-section-icon">
                        <EnvelopeIcon aria-hidden="true" />
                    </span>
                    <div>
                        <h2 id="dashboard-mail-title">Доставка писем</h2>
                        <p className="admin-muted">
                            По заявкам выбранного периода
                        </p>
                    </div>
                    <span
                        className={
                            'dashboard-mail-mode' +
                            (!data.mailDeliveryEnabled
                                ? ' dashboard-mail-disabled'
                                : '')
                        }
                    >
                        {data.mailDeliveryEnabled ? (
                            <CheckCircleIcon aria-hidden="true" />
                        ) : (
                            <ExclamationTriangleIcon aria-hidden="true" />
                        )}
                        {data.mailDeliveryEnabled
                            ? 'Отправка включена'
                            : 'Отправка выключена'}
                    </span>
                </div>
                <div className="dashboard-mail-counts">
                    {(
                        [
                            [
                                'Принято почтовым сервером',
                                data.mail.sent,
                                'sent',
                            ],
                            ['Ожидают отправки', data.mail.pending, 'pending'],
                            ['Ошибка отправки', data.mail.failed, 'failed'],
                        ] as const
                    ).map(([label, value, status]) => (
                        <Link
                            key={status}
                            href={'/admin/requests?mail=' + status}
                            className={
                                status === 'failed' && value > 0
                                    ? 'dashboard-danger'
                                    : ''
                            }
                        >
                            <span
                                className={
                                    'dashboard-dot dashboard-dot-' + status
                                }
                                aria-hidden="true"
                            />
                            <span>{label}</span>
                            <strong>{value}</strong>
                            <ArrowRightIcon aria-hidden="true" />
                        </Link>
                    ))}
                </div>
                <p className="dashboard-caption">
                    {!data.mailDeliveryEnabled
                        ? 'Заявки сохраняются, но письма сейчас не отправляются. '
                        : ''}
                    {mailError
                        ? 'Есть ошибки отправки: откройте их в блоке выше. '
                        : ''}
                    Принятие почтовым сервером не подтверждает прочтение письма.
                </p>
            </section>

            <section aria-labelledby="dashboard-content-title">
                <div className="dashboard-section-heading">
                    <div>
                        <h2 id="dashboard-content-title">
                            Каталог и публикации
                        </h2>
                        <p className="admin-muted">
                            Состояние сейчас, независимо от выбранного периода
                            заявок.
                        </p>
                    </div>
                </div>
                <div className="dashboard-inventory-grid">
                    {inventory.map(
                        ({
                            title,
                            icon: Icon,
                            total,
                            href,
                            action,
                            create,
                            hint,
                            rows,
                        }) => (
                            <section
                                key={title}
                                className="admin-panel dashboard-inventory"
                                aria-label={title}
                            >
                                <div className="dashboard-inventory-heading">
                                    <span className="dashboard-section-icon">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h3>
                                            <Link href={href}>
                                                {title}
                                                <ArrowRightIcon aria-hidden="true" />
                                            </Link>
                                        </h3>
                                        <p className="admin-muted">{hint}</p>
                                    </div>
                                    <strong>{total}</strong>
                                </div>
                                <ul className="dashboard-inventory-rows">
                                    {rows.map(([label, value, target]) => (
                                        <li key={label}>
                                            <Link href={target}>
                                                <span>{label}</span>
                                                <strong>{value}</strong>
                                                <ArrowRightIcon aria-hidden="true" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                {title === 'Статьи' && (
                                    <p className="dashboard-caption">
                                        Расписание включает первые публикации и
                                        обновления; оно может пересекаться со
                                        статусами выше.
                                    </p>
                                )}
                                <Link href={create} className="admin-button">
                                    <PlusIcon aria-hidden="true" />
                                    {action}
                                </Link>
                            </section>
                        ),
                    )}
                </div>
            </section>
            <footer className="dashboard-footer">
                Данные собственной БД. Старые заявки удаляются по сроку
                хранения, поэтому «все сохранённые» — доступные сейчас записи.
                Посещения, конверсия и выручка здесь не измеряются.
            </footer>
        </div>
    )
}
