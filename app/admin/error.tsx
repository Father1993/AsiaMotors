'use client'
export default function AdminError({ reset }: { reset: () => void }) {
    return (
        <div className="admin-panel" role="alert">
            <h1>Не удалось загрузить данные</h1>
            <p className="admin-muted my-4">
                Проверьте соединение и попробуйте ещё раз. Сохранённые автомобили остаются в базе.
            </p>
            <button className="admin-button" onClick={reset}>
                Повторить загрузку
            </button>
        </div>
    )
}
