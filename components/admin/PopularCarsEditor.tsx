'use client'

import { useEffect, useState } from 'react'
import { POPULAR_CARS_LIMIT } from '@/shared/constants/popular-cars'
import { apiRequest } from '@/shared/lib/catalog-client'
import type { listPopularCarChoices } from '@/shared/lib/server/popular-cars'
import { useAdminNavigation } from './AdminShell'

type Choice = Awaited<ReturnType<typeof listPopularCarChoices>>[number]

function carName(car: Choice) {
    return [car.brand, car.model, car.year].filter(Boolean).join(' ')
}

export function PopularCarsEditor({ cars }: { cars: Choice[] }) {
    const [saved, setSaved] = useState(() => cars.filter((car) => car.featured_position !== null).map((car) => car.id))
    const [ids, setIds] = useState(saved)
    const [search, setSearch] = useState('')
    const [choice, setChoice] = useState('')
    const [busy, setBusy] = useState(false)
    const [notice, setNotice] = useState('')
    const [error, setError] = useState('')
    const { setDirty } = useAdminNavigation()
    const dirty = JSON.stringify(ids) !== JSON.stringify(saved)

    useEffect(() => {
        setDirty(dirty)
        if (!dirty) return
        const warn = (event: BeforeUnloadEvent) => event.preventDefault()
        window.addEventListener('beforeunload', warn)
        return () => {
            setDirty(false)
            window.removeEventListener('beforeunload', warn)
        }
    }, [dirty, setDirty])

    const choices = cars.filter((car) => car.status === 'published' && !ids.includes(car.id)
        && carName(car).toLowerCase().includes(search.trim().toLowerCase()))
    const selected = choices.find((car) => car.id === choice)

    function move(index: number, offset: number) {
        const next = [...ids]
        const target = index + offset
        ;[next[index], next[target]] = [next[target], next[index]]
        setIds(next)
        setNotice('')
    }

    async function save() {
        setBusy(true)
        setError('')
        setNotice('')
        try {
            await apiRequest('/api/admin/popular-cars', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, previous: saved }),
            })
            setSaved(ids)
            setNotice('Подборка сохранена.')
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Не удалось сохранить подборку.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="max-w-4xl space-y-5">
            <div>
                <h1>Популярные модели</h1>
                <p className="admin-muted">Выберите автомобили и задайте порядок их показа на главной.</p>
            </div>

            <section className="admin-panel space-y-4" aria-labelledby="popular-add-heading">
                <h2 id="popular-add-heading">Добавить автомобиль</h2>
                <fieldset disabled={busy || ids.length >= POPULAR_CARS_LIMIT} className="grid gap-3 sm:grid-cols-2">
                    <div className="admin-field">
                        <label htmlFor="popular-search">Поиск по марке, модели или году</label>
                        <input id="popular-search" value={search} onChange={(event) => setSearch(event.target.value)} />
                    </div>
                    <div className="admin-field">
                        <label htmlFor="popular-choice">Опубликованные автомобили</label>
                        <select id="popular-choice" value={selected?.id ?? ''} onChange={(event) => setChoice(event.target.value)}>
                            <option value="">{choices.length ? 'Выберите автомобиль' : 'Нет подходящих автомобилей'}</option>
                            {choices.map((car) => <option key={car.id} value={car.id}>{carName(car)}</option>)}
                        </select>
                    </div>
                    <button
                        type="button"
                        className="admin-button justify-self-start"
                        disabled={!selected}
                        onClick={() => {
                            if (!selected) return
                            setIds([...ids, selected.id])
                            setChoice('')
                            setSearch('')
                            setNotice('')
                        }}
                    >
                        Добавить в подборку
                    </button>
                </fieldset>
            </section>

            <section className="admin-panel space-y-4" aria-labelledby="popular-order-heading">
                <h2 id="popular-order-heading">Порядок показа · {ids.length} из {POPULAR_CARS_LIMIT}</h2>
                {ids.length === 0 && <p className="admin-muted">Подборка пуста. На главной показаны последние опубликованные автомобили.</p>}
                <ol className="divide-y">
                    {ids.map((id, index) => {
                        const car = cars.find((item) => item.id === id)!
                        const name = carName(car)
                        return (
                            <li key={id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                                <div className="min-w-0">
                                    <span className="admin-muted mr-2">{index + 1}.</span>
                                    <strong>{name}</strong>
                                    {car.status !== 'published' && <span className="admin-muted block">Скрыт на сайте</span>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" className="admin-button" disabled={busy || index === 0}
                                        aria-label={`Выше: ${name}`} onClick={() => move(index, -1)}>↑ Выше</button>
                                    <button type="button" className="admin-button" disabled={busy || index === ids.length - 1}
                                        aria-label={`Ниже: ${name}`} onClick={() => move(index, 1)}>↓ Ниже</button>
                                    <button type="button" className="admin-button admin-button-quiet" disabled={busy}
                                        aria-label={`Убрать из подборки: ${name}`} onClick={() => {
                                            setIds(ids.filter((item) => item !== id))
                                            setNotice('')
                                        }}>Убрать</button>
                                </div>
                            </li>
                        )
                    })}
                </ol>
                <button type="button" className="admin-button admin-button-primary" disabled={!dirty || busy} onClick={save}>
                    {busy ? 'Сохранение…' : 'Сохранить подборку'}
                </button>
                {notice && <p role="status">{notice}</p>}
                {error && <p role="alert" className="admin-field-error">{error}</p>}
            </section>
        </div>
    )
}
