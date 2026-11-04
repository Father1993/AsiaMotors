import Link from "next/link";
import { requireAdmin } from "@/shared/lib/server/http";
import { getDashboard } from "@/shared/lib/server/dashboard";
import { adminDate } from "@/shared/lib/admin-date";
import "./dashboard.css";
export const metadata = { title: "Обзор работы | AsiaMotors" };
export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  await requireAdmin();
  const { period } = await searchParams;
  const data = await getDashboard(
    typeof period === "string" ? period : undefined,
  );
  return (
    <>
      <div className="admin-titlebar">
        <div>
          <h1>Обзор работы</h1>
          <p className="admin-muted">
            Заявки, почта и состояние материалов сайта
          </p>
        </div>
        <Link
          className="admin-button"
          href={"/admin/dashboard?period=" + data.period}
        >
          Обновить
        </Link>
      </div>
      <form action="/admin/dashboard" className="admin-panel dashboard-period">
        <label htmlFor="dashboard-period">
          Заявки за период
          <select
            id="dashboard-period"
            name="period"
            defaultValue={data.period}
          >
            <option value="7">7 дней</option>
            <option value="30">30 дней</option>
            <option value="90">90 дней</option>
            <option value="all">Все сохранённые</option>
          </select>
        </label>
        <button className="admin-button" type="submit">
          Показать
        </button>
        <p className="admin-muted">
          {data.since ? adminDate(data.since, true) + " — " : ""}
          {adminDate(data.until, true)} · Владивосток (UTC+10)
        </p>
      </form>
      <p className="admin-muted">
        Период определяется датой получения заявки. Статусы показывают её
        текущее состояние. Старые заявки удаляются согласно сроку хранения,
        поэтому «все сохранённые» означает все доступные записи.
      </p>
      <section aria-labelledby="dashboard-backlog">
        <h2 id="dashboard-backlog">Требуют внимания сейчас</h2>
        <p className="admin-muted">
          Все сохранённые заявки, независимо от выбранного периода.
        </p>
        <div className="dashboard-grid">
          {(
            [
              ["Новые заявки", data.backlog.new, "/admin/requests?status=new"],
              [
                "Заявки в работе",
                data.backlog.processing,
                "/admin/requests?status=processing",
              ],
              [
                "Письма в очереди",
                data.backlog.pending,
                "/admin/requests?mail=pending",
              ],
              [
                "Ошибки почты",
                data.backlog.failed,
                "/admin/requests?mail=failed",
              ],
            ] as const
          ).map(([label, value, href]) => (
            <Link
              key={label}
              href={href}
              className={
                "admin-panel dashboard-stat" +
                (label === "Ошибки почты" && value > 0
                  ? " dashboard-stat-alert"
                  : "")
              }
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </Link>
          ))}
        </div>
      </section>
      <section aria-labelledby="dashboard-leads">
        <h2 id="dashboard-leads">Заявки за выбранный период</h2>
        <div className="dashboard-grid">
          {(
            [
              ["Всего", data.requests.total, "/admin/requests"],
              ["Новые", data.requests.new, "/admin/requests?status=new"],
              [
                "В работе",
                data.requests.processing,
                "/admin/requests?status=processing",
              ],
              [
                "Закрытые",
                data.requests.closed,
                "/admin/requests?status=closed",
              ],
            ] as const
          ).map(([label, value, href]) => (
            <Link
              href={href}
              className="admin-panel dashboard-stat"
              key={label}
            >
              <span>{label}</span>
              <strong>{value}</strong>
              <small>Открыть полный список ↗</small>
            </Link>
          ))}
        </div>
      </section>
      <section aria-labelledby="dashboard-mail">
        <h2 id="dashboard-mail">Письма по этим заявкам</h2>
        <p className="admin-muted">
          Отправка {data.mailDeliveryEnabled ? "включена" : "выключена"}.
          Принятие почтовым сервером не подтверждает прочтение письма.
        </p>
        <div className="dashboard-grid">
          {(
            [
              ["Ожидают отправки", data.mail.pending, "pending"],
              ["Принято почтовым сервером", data.mail.sent, "sent"],
              ["Ошибка отправки", data.mail.failed, "failed"],
            ] as const
          ).map(([label, value, mail]) => (
            <Link
              href={"/admin/requests?mail=" + mail}
              key={mail}
              className="admin-panel dashboard-stat"
            >
              <span>{label}</span>
              <strong>{value}</strong>
              <small>Открыть полный список ↗</small>
            </Link>
          ))}
        </div>
      </section>
      <div className="dashboard-grid dashboard-details">
        <section className="admin-panel">
          <h2>Источники заявок</h2>
          {data.sources.length ? (
            <table>
              <thead>
                <tr>
                  <th scope="col">Форма</th>
                  <th scope="col">Заявок</th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((source) => (
                  <tr key={source.source}>
                    <th scope="row">{source.source}</th>
                    <td>{source.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-muted">За этот период заявок нет.</p>
          )}
        </section>
        <section className="admin-panel">
          <h2>Поступление по дням</h2>
          <p className="admin-muted">
            Даты Владивостока. Дни без заявок не перечисляются.
          </p>
          {data.daily.length ? (
            <details>
              <summary>Показать дни с заявками ({data.daily.length})</summary>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Дата</th>
                    <th scope="col">Заявок</th>
                  </tr>
                </thead>
                <tbody>
                  {data.daily.map((day) => (
                    <tr key={day.day}>
                      <th scope="row">
                        {adminDate(day.day + "T00:00:00+10:00", true)}
                      </th>
                      <td>{day.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          ) : (
            <p className="admin-muted">За этот период заявок нет.</p>
          )}
        </section>
      </div>
      <section aria-labelledby="dashboard-stock">
        <h2 id="dashboard-stock">Каталог сейчас</h2>
        <p className="admin-muted">
          Все автомобили, независимо от выбранного периода заявок.
        </p>
        <div className="dashboard-grid">
          {(
            [
              ["Опубликовано", data.cars.published, "/admin?status=published"],
              [
                "В наличии на сайте",
                data.cars.available,
                "/admin?status=published&available=true",
              ],
              [
                "Под заказ на сайте",
                data.cars.onOrder,
                "/admin?status=published&available=false",
              ],
              ["Черновики", data.cars.draft, "/admin?status=draft"],
              ["Скрытые", data.cars.hidden, "/admin?status=hidden"],
            ] as const
          ).map(([label, value, href]) => (
            <Link
              key={label}
              href={href}
              className="admin-panel dashboard-stat"
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </Link>
          ))}
        </div>
      </section>
      <section aria-labelledby="dashboard-articles">
        <h2 id="dashboard-articles">Статьи сейчас</h2>
        <p className="admin-muted">
          Все материалы. Запланированная публикация может относиться к черновику
          или обновлению опубликованной статьи.
        </p>
        <div className="dashboard-grid">
          {(
            [
              [
                "Опубликованные новые",
                data.articles.published,
                "/admin/blog?source=new&status=published",
              ],
              [
                "Черновики",
                data.articles.draft,
                "/admin/blog?source=new&status=draft",
              ],
              [
                "Скрытые",
                data.articles.hidden,
                "/admin/blog?source=new&status=hidden",
              ],
              [
                "Запланировано",
                data.articles.scheduled,
                "/admin/blog?source=new&status=scheduled",
              ],
              ["Архивные", data.articles.archive, "/admin/blog?source=archive"],
            ] as const
          ).map(([label, value, href]) => (
            <Link
              key={label}
              href={href}
              className="admin-panel dashboard-stat"
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </Link>
          ))}
        </div>
      </section>
      <p className="admin-muted">
        Обновлено: {adminDate(data.until)}. Здесь учитываются данные собственной
        БД; посещения, конверсия и выручка не измеряются. Ссылки открывают
        полные рабочие списки без ограничения периода.
      </p>
    </>
  );
}
