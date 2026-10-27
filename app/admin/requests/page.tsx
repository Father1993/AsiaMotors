'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from '@/shared/lib/catalog-client'
import { toast } from 'react-hot-toast'
type Lead = {
    id: string
    payload: Record<string, string>
    status: string
    created_at: string
    mail_status: string
    attempts: number
    last_error: string | null
}
const labels: Record<string, string> = {
    form_name: 'Форма',
    user_name: 'Имя',
    user_phone: 'Телефон',
    user_city: 'Город',
    car_model: 'Автомобиль',
    message: 'Сообщение',
    car_year: 'Год',
    vin_number: 'VIN',
    part_name: 'Запчасть',
    part_number: 'Артикул',
}
export default function Requests() {
    const [items, setItems] = useState<Lead[]>([])
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    async function load(current: number) {
        setLoading(true)
        try {
            setItems(
                (
                    await apiRequest<{ leads: Lead[] }>(
                        '/api/admin/leads?page=' + current
                    )
                ).leads
            )
        } catch {
            toast.error('Не удалось загрузить заявки')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        void load(page)
    }, [page])
    async function change(id: string, body: object) {
        try {
            await apiRequest('/api/admin/leads/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            await load(page)
        } catch {
            toast.error('Не удалось обновить заявку')
        }
    }
    async function remove(id: string) {
        if (!confirm('Удалить заявку и её персональные данные?')) return
        try {
            await apiRequest('/api/admin/leads/' + id, { method: 'DELETE' })
            await load(page)
        } catch {
            toast.error('Не удалось удалить заявку')
        }
    }
    return (
        <div className="container py-20">
            <Link href="/admin" className="text-blue-700 underline">
                ← Каталог
            </Link>
            <h1 className="text-3xl font-bold my-6">Заявки с сайта</h1>
            <button
                onClick={() => load(page)}
                className="border rounded px-4 py-2 mb-4"
                disabled={loading}
            >
                Обновить
            </button>
            {loading ? (
                <p>Загрузка…</p>
            ) : items.length === 0 ? (
                <p>Заявок пока нет.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="border rounded-lg p-4 bg-white"
                        >
                            <p className="text-sm text-gray-500">
                                {new Date(item.created_at).toLocaleString(
                                    'ru-RU'
                                )}{' '}
                                · {item.id}
                            </p>
                            <dl className="my-3">
                                {Object.entries(labels)
                                    .filter(([key]) => item.payload[key])
                                    .map(([key, label]) => (
                                        <div
                                            key={key}
                                            className="mb-1 break-words whitespace-pre-wrap"
                                        >
                                            <dt className="inline font-semibold">
                                                {label}:{' '}
                                            </dt>
                                            <dd className="inline">
                                                {item.payload[key]}
                                            </dd>
                                        </div>
                                    ))}
                            </dl>
                            <p>
                                Письмо:{' '}
                                {item.mail_status === 'sent'
                                    ? 'принято почтовым сервером'
                                    : item.mail_status === 'failed'
                                      ? 'ошибка доставки'
                                      : 'в очереди'}{' '}
                                · попыток: {item.attempts}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <select
                                    aria-label="Статус заявки"
                                    className="border rounded"
                                    value={item.status}
                                    onChange={(e) =>
                                        change(item.id, {
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="new">Новая</option>
                                    <option value="processing">В работе</option>
                                    <option value="closed">Закрыта</option>
                                </select>
                                {item.mail_status === 'failed' && (
                                    <button
                                        className="text-blue-700"
                                        onClick={() =>
                                            change(item.id, { retry: true })
                                        }
                                    >
                                        Повторить отправку
                                    </button>
                                )}
                                <button
                                    className="text-red-700"
                                    onClick={() => remove(item.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            <div className="flex gap-4 mt-6">
                <button
                    disabled={page === 0 || loading}
                    onClick={() => setPage(page - 1)}
                >
                    Назад
                </button>
                <span>Страница {page + 1}</span>
                <button
                    disabled={items.length < 50 || loading}
                    onClick={() => setPage(page + 1)}
                >
                    Далее
                </button>
            </div>
        </div>
    )
}
