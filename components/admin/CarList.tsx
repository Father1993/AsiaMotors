'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApiError, apiRequest } from '@/shared/lib/catalog-client'
import { formatPrice, generateCarSlug } from '@/shared/utils/catalog'
import type { AdminCarRecord, CountryRecord } from '@/shared/types/database.types'
import { CarStatusBadge, carStatusLabels as statusNames } from './CarStatus'
import { ConfirmDialog } from './ConfirmDialog'
import './car-list.css'

type Result = { cars: AdminCarRecord[]; total: number; page: number; pageSize: number }

export function CarList({ countries }: { countries: CountryRecord[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.toString()
    const returnTo = '/admin' + (query ? '?' + query : '')
    const returnQuery = '?returnTo=' + encodeURIComponent(returnTo)
    const [result, setResult] = useState<Result | null>(null)
    const [loadedKey, setLoadedKey] = useState<string | null>(null)
    const [reload, setReload] = useState(0)
    const [error, setError] = useState<ApiError | null>(null)
    const [notice, setNotice] = useState('')
    const [pending, setPending] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<AdminCarRecord | null>(null)
    const loadKey = query + ':' + reload
    const loading = loadedKey !== loadKey
    const actionLock = useRef(false)
    const currentQuery = useRef(query)

    useEffect(() => {
        currentQuery.current = query
        const controller = new AbortController()
        apiRequest<Result>('/api/cars' + (query ? '?' + query : ''), { signal: controller.signal })
            .then((data) => {
                if (!controller.signal.aborted) {
                    setResult(data)
                    setError(null)
                }
            })
            .catch((cause) => {
                if (!controller.signal.aborted)
                    setError(
                        cause instanceof ApiError
                            ? cause
                            : new ApiError('Не удалось загрузить автомобили. Проверьте соединение.', 0),
                    )
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadedKey(loadKey)
            })
        return () => controller.abort()
    }, [query, loadKey])

    function pageUrl(page: number) {
        const params = new URLSearchParams(query)
        if (page > 1) params.set('page', String(page))
        else params.delete('page')
        return '/admin' + (params.size ? '?' + params.toString() : '')
    }
    async function act(car: AdminCarRecord, method: 'PATCH' | 'DELETE') {
        if (actionLock.current) return
        actionLock.current = true
        setPending(car.id)
        setError(null)
        setNotice('')
        try {
            await apiRequest('/api/cars/' + car.id, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    version: car.version,
                    ...(method === 'PATCH'
                        ? { status: car.status === 'published' ? 'hidden' : 'published' }
                        : {}),
                }),
            })
            setDeleting(null)
            setNotice(
                method === 'DELETE'
                    ? 'Автомобиль удалён.'
                    : car.status === 'published'
                      ? 'Автомобиль скрыт с сайта.'
                      : 'Автомобиль возвращён на сайт.',
            )
            if (
                method === 'DELETE' &&
                result?.cars.length === 1 &&
                result.page > 1 &&
                currentQuery.current === query
            )
                router.replace(pageUrl(result.page - 1), { scroll: false })
            else setReload((value) => value + 1)
        } catch (cause) {
            setDeleting(null)
            const problem =
                cause instanceof ApiError
                    ? cause
                    : new ApiError('Не удалось сохранить изменения. Проверьте соединение и повторите.', 0)
            if (problem.status === 409) {
                setNotice(
                    'Автомобиль изменён в другой вкладке. Список обновлён; проверьте данные и повторите действие.',
                )
                setReload((value) => value + 1)
            } else setError(problem)
        } finally {
            actionLock.current = false
            setPending(null)
        }
    }
    function actions(car: AdminCarRecord) {
        return (
            <div className="car-list-actions">
                <Link className="admin-button" href={'/admin/cars/' + car.id + returnQuery}>
                    Редактировать
                    <span className="sr-only">
                        {' '}
                        {car.brand} {car.model}
                    </span>
                </Link>
                {car.status === 'published' && (
                    <Link
                        className="admin-button admin-button-quiet"
                        href={'/catalog/' + generateCarSlug(car)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        На сайте ↗
                        <span className="sr-only">
                            {' '}
                            {car.brand} {car.model}
                        </span>
                    </Link>
                )}
                {car.status !== 'draft' && (
                    <button
                        type="button"
                        className="admin-button admin-button-quiet"
                        disabled={pending !== null}
                        onClick={() => void act(car, 'PATCH')}
                    >
                        {pending === car.id
                            ? 'Подождите…'
                            : car.status === 'published'
                              ? 'Скрыть'
                              : 'Вернуть на сайт'}
                        <span className="sr-only">
                            {' '}
                            {car.brand} {car.model}
                        </span>
                    </button>
                )}
                <button
                    type="button"
                    className="admin-button admin-button-quiet admin-button-danger"
                    disabled={pending !== null}
                    onClick={() => setDeleting(car)}
                >
                    Удалить
                    <span className="sr-only">
                        {' '}
                        {car.brand} {car.model}
                    </span>
                </button>
            </div>
        )
    }
    function identity(car: AdminCarRecord) {
        return (
            <div className="car-list-identity">
                <Link
                    href={'/admin/cars/' + car.id + returnQuery}
                    className="car-list-photo"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    {car.images[0] ? (
                        <Image src={car.images[0]} alt="" width={96} height={72} sizes="96px" />
                    ) : (
                        <span>Нет фото</span>
                    )}
                </Link>
                <div>
                    <Link href={'/admin/cars/' + car.id + returnQuery} className="car-list-name">
                        {car.brand} {car.model}
                    </Link>
                    <p className="admin-muted">
                        {car.year ? `${car.year} г.` : 'Год не указан'} ·{' '}
                        {countries.find((country) => country.id === car.country_id)?.name ||
                            'Страна не указана'}
                    </p>
                </div>
            </div>
        )
    }
    const filtered = ['q', 'status', 'country', 'available'].some((key) => searchParams.has(key))
    const pages = Math.max(1, Math.ceil((result?.total || 0) / (result?.pageSize || 25)))
    return (
        <>
            <div className="admin-titlebar">
                <div>
                    <h1>Автомобили</h1>
                    <p className="admin-muted">Каталог, фотографии и публикация на сайте</p>
                </div>
                <Link className="admin-button admin-button-primary" href={'/admin/cars/new' + returnQuery}>
                    + Добавить автомобиль
                </Link>
            </div>
            <section className="admin-panel car-list-filters" aria-label="Поиск и фильтры">
                <form
                    key={query}
                    onSubmit={(event) => {
                        event.preventDefault()
                        const params = new URLSearchParams()
                        new FormData(event.currentTarget).forEach((value, key) => {
                            if (String(value).trim()) params.set(key, String(value).trim())
                        })
                        router.push('/admin' + (params.size ? '?' + params.toString() : ''), {
                            scroll: false,
                        })
                    }}
                >
                    <div className="admin-field car-list-search">
                        <label htmlFor="cars-q">Марка или модель</label>
                        <input
                            id="cars-q"
                            name="q"
                            type="search"
                            autoComplete="off"
                            placeholder="Например, Toyota Camry…"
                            defaultValue={searchParams.get('q') || ''}
                            maxLength={150}
                        />
                    </div>
                    <div className="admin-field">
                        <label htmlFor="cars-country">Страна каталога</label>
                        <select
                            id="cars-country"
                            name="country"
                            defaultValue={searchParams.get('country') || ''}
                        >
                            <option value="">Все страны</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="admin-field">
                        <label htmlFor="cars-status">Публикация</label>
                        <select
                            id="cars-status"
                            name="status"
                            defaultValue={searchParams.get('status') || ''}
                        >
                            <option value="">Все состояния</option>
                            {Object.entries(statusNames).map(([key, name]) => (
                                <option key={key} value={key}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="admin-field">
                        <label htmlFor="cars-stock">Наличие</label>
                        <select
                            id="cars-stock"
                            name="available"
                            defaultValue={searchParams.get('available') || ''}
                        >
                            <option value="">Все автомобили</option>
                            <option value="true">В наличии</option>
                            <option value="false">Под заказ</option>
                        </select>
                    </div>
                    <button type="submit" className="admin-button">
                        Найти
                    </button>
                    {filtered && (
                        <Link href="/admin" className="admin-button admin-button-quiet">
                            Сбросить
                        </Link>
                    )}
                </form>
            </section>
            {notice && (
                <p role="status" className="car-list-notice">
                    {notice}
                </p>
            )}
            {!loading && error && (
                <div role="alert" className="admin-notice car-list-feedback">
                    <p>{error.message}</p>
                    {error.status === 401 ? (
                        <Link href="/auth/signin?callbackUrl=%2Fadmin" className="admin-button">
                            Войти снова
                        </Link>
                    ) : (
                        <button
                            type="button"
                            className="admin-button"
                            onClick={() => setReload((value) => value + 1)}
                        >
                            Повторить загрузку
                        </button>
                    )}
                </div>
            )}
            <section
                className="admin-panel car-list-results"
                aria-label="Список автомобилей"
                aria-busy={loading}
            >
                {loading ? (
                    <div role="status" className="car-list-loading">
                        <p>Загрузка автомобилей…</p>
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="car-list-skeleton" aria-hidden="true" />
                        ))}
                    </div>
                ) : !result ? null : result.cars.length === 0 ? (
                    <div className="car-list-empty">
                        <h2>
                            {filtered
                                ? 'Автомобили не найдены'
                                : result.total
                                  ? 'На этой странице нет автомобилей'
                                  : 'Начните с первого автомобиля'}
                        </h2>
                        <p className="admin-muted">
                            {filtered
                                ? 'Измените поисковый запрос или сбросьте фильтры.'
                                : result.total
                                  ? 'Перейдите на предыдущую страницу списка.'
                                  : 'Сохраните марку и модель как черновик, затем добавьте характеристики и фотографии.'}
                        </p>
                        {filtered ? (
                            <Link href="/admin" className="admin-button">
                                Сбросить фильтры
                            </Link>
                        ) : (
                            !result.total && (
                                <Link
                                    href={'/admin/cars/new' + returnQuery}
                                    className="admin-button admin-button-primary"
                                >
                                    Добавить автомобиль
                                </Link>
                            )
                        )}
                    </div>
                ) : (
                    <>
                        <p className="car-list-count">
                            Найдено: <strong>{result.total}</strong>
                        </p>
                        <table className="car-list-table">
                            <caption className="sr-only">Автомобили в каталоге</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Автомобиль</th>
                                    <th scope="col">Цена</th>
                                    <th scope="col">Публикация и наличие</th>
                                    <th scope="col">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.cars.map((car) => (
                                    <tr key={car.id}>
                                        <td>{identity(car)}</td>
                                        <td className="car-list-price">
                                            {car.price === null ? (
                                                <span className="admin-muted">Не указана</span>
                                            ) : (
                                                formatPrice(car.price)
                                            )}
                                        </td>
                                        <td>
                                            <CarStatusBadge status={car.status} />
                                            <p className="car-list-stock">
                                                {car.available ? 'В наличии' : 'Под заказ'}
                                            </p>
                                        </td>
                                        <td>{actions(car)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="car-list-cards">
                            {result.cars.map((car) => (
                                <article key={car.id} className="car-list-card">
                                    {identity(car)}
                                    <div className="car-list-card-details">
                                        <p className="car-list-price">
                                            {car.price === null ? 'Цена не указана' : formatPrice(car.price)}
                                        </p>
                                        <CarStatusBadge status={car.status} />
                                        <p className="admin-muted">
                                            {car.available ? 'В наличии' : 'Под заказ'}
                                        </p>
                                    </div>
                                    {actions(car)}
                                </article>
                            ))}
                        </div>
                    </>
                )}
                {!loading && result && result.total > 0 && (
                    <nav aria-label="Страницы автомобилей" className="car-list-pagination">
                        {result.page > 1 ? (
                            <Link href={pageUrl(result.page - 1)} className="admin-button" scroll={false}>
                                ← Назад
                            </Link>
                        ) : (
                            <span />
                        )}
                        <span>
                            Страница {result.page} из {pages}
                        </span>
                        {result.page < pages ? (
                            <Link href={pageUrl(result.page + 1)} className="admin-button" scroll={false}>
                                Далее →
                            </Link>
                        ) : (
                            <span />
                        )}
                    </nav>
                )}
            </section>
            <ConfirmDialog
                open={deleting !== null}
                title="Удалить автомобиль?"
                description={
                    deleting
                        ? `${deleting.brand} ${deleting.model}${deleting.year ? `, ${deleting.year} г.` : ''} будет удалён из каталога. Восстановить запись нельзя.`
                        : ''
                }
                confirmLabel="Удалить автомобиль"
                pending={pending !== null}
                onClose={() => setDeleting(null)}
                onConfirm={() => {
                    if (deleting) void act(deleting, 'DELETE')
                }}
            />
        </>
    )
}
