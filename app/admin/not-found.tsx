import Link from 'next/link'
export default function AdminNotFound() {
    return (
        <div className="admin-panel">
            <h1>Автомобиль не найден</h1>
            <p className="admin-muted my-4">Возможно, запись уже удалили. Вернитесь к списку автомобилей.</p>
            <Link href="/admin" className="admin-button">
                К автомобилям
            </Link>
        </div>
    )
}
