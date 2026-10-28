'use client'

import { useEffect, useRef, useState } from 'react'
import { ZodError } from 'zod'
import { ApiError, apiRequest } from '@/shared/lib/catalog-client'
import { parseCarInput, type CarData } from '@/shared/lib/car-schema'
import type { AdminCarRecord, CarStatus } from '@/shared/types/database.types'
import { useAdminNavigation } from './AdminShell'

export type EditorValues = Omit<Extract<CarData, { status: 'draft' }>, 'status'>
export function editorValues(car?: CarData): EditorValues {
    return {
        brand: car?.brand || '',
        model: car?.model || '',
        country_id: car?.country_id ?? null,
        year: car?.year ?? null,
        price: car?.price ?? null,
        category: car?.category || '',
        equipment: car?.equipment || '',
        images: car?.images || [],
        available: car?.available ?? true,
        specs: {
            mileage: car?.specs.mileage,
            engineVolume: car?.specs.engineVolume,
            horsePower: car?.specs.horsePower,
            fuelType: car?.specs.fuelType,
            transmission: car?.specs.transmission,
            driveType: car?.specs.driveType,
            color: car?.specs.color || '',
            generation: car?.specs.generation || '',
            features: car?.specs.features || [],
        },
    }
}
const snapshot = (values: EditorValues) => JSON.stringify(values)
function controlErrors(errors: Record<string, string[]>) {
    const result: Record<string, string[]> = {}
    for (const [path, messages] of Object.entries(errors)) {
        const control = path.startsWith('specs.features.')
            ? 'specs.features'
            : path.startsWith('images.')
              ? 'images'
              : path
        ;(result[control] ??= []).push(...messages)
    }
    return result
}
type Attempt = { data: CarData; version: number | null }
type Recovery = {
    id: string
    values: EditorValues
    version: number | null
    status: CarStatus
    pending: Attempt | null
}

export function useCarEditor(initial: AdminCarRecord | undefined, uploading: boolean) {
    const [id, setId] = useState(() => initial?.id || crypto.randomUUID())
    const [version, setVersion] = useState<number | null>(initial?.version ?? null)
    const [status, setStatus] = useState<CarStatus>(initial?.status || 'draft')
    const [values, setValues] = useState(() => editorValues(initial))
    const [baseline, setBaseline] = useState(() => snapshot(editorValues(initial)))
    const [saving, setSaving] = useState<CarStatus | null>(null)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [notice, setNotice] = useState('')
    const [problem, setProblem] = useState<number | null>(null)
    const [savedAt, setSavedAt] = useState(initial?.updated_at || '')
    const [pending, setPending] = useState<Attempt | null>(null)
    const [recovery, setRecovery] = useState<Recovery | null>(null)
    const [ready, setReady] = useState(false)
    const busy = useRef(false)
    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])
    const { setDirty } = useAdminNavigation()
    const dirty = snapshot(values) !== baseline
    const cacheKey = 'asiamotors:car:' + (initial?.id || (version === null ? 'new' : id))

    useEffect(() => {
        // Restore browser-only external state after hydration; never change server HTML.
        function readRecovery() {
            try {
                const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null') as Recovery | null
                if (
                    cached &&
                    /^[0-9a-f-]{36}$/.test(cached.id) &&
                    cached.values?.specs &&
                    Array.isArray(cached.values.images)
                ) {
                    setRecovery(cached)
                }
            } catch {
                /* Storage may be unavailable or contain an obsolete draft. */
            }
            setReady(true)
        }
        readRecovery()
    }, [cacheKey])
    useEffect(() => {
        if (!ready || recovery) return
        try {
            if (dirty || pending)
                sessionStorage.setItem(cacheKey, JSON.stringify({ id, values, version, status, pending }))
            else sessionStorage.removeItem(cacheKey)
        } catch {
            /* Saving to PostgreSQL remains available when browser storage is full. */
        }
    }, [cacheKey, id, values, version, status, pending, dirty, ready, recovery])
    useEffect(() => {
        setDirty(dirty || uploading || !!saving)
        return () => setDirty(false)
    }, [dirty, uploading, saving, setDirty])
    useEffect(() => {
        if (!dirty && !uploading && !saving) return
        const warn = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ''
        }
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [dirty, uploading, saving])

    function restoreRecovery() {
        if (!recovery) return
        setId(recovery.id)
        setVersion(recovery.version)
        setStatus(recovery.status)
        setValues(recovery.values)
        setPending(recovery.pending)
        setRecovery(null)
        setNotice('Несохранённые данные восстановлены. Проверьте их перед сохранением.')
    }
    function discardRecovery() {
        try {
            sessionStorage.removeItem(cacheKey)
        } catch {
            /* Browser storage is optional. */
        }
        setRecovery(null)
    }
    function clearError(name: string) {
        setErrors((previous) => {
            const next = { ...previous }
            delete next[name]
            return next
        })
    }
    function accept(record: AdminCarRecord, replace: boolean) {
        if (!mounted.current) return
        try {
            sessionStorage.removeItem(cacheKey)
        } catch {
            /* Browser storage is optional. */
        }
        setId(record.id)
        setVersion(record.version)
        setStatus(record.status)
        setBaseline(snapshot(editorValues(record)))
        setSavedAt(record.updated_at)
        setPending(null)
        if (replace) setValues(editorValues(record))
        if (!initial)
            window.history.replaceState(
                window.history.state,
                '',
                '/admin/cars/' + record.id + window.location.search,
            )
        setProblem(null)
        setNotice(
            record.status === 'published' ? 'Изменения сохранены и опубликованы.' : 'Изменения сохранены.',
        )
    }
    function showError(error: unknown) {
        if (!mounted.current) return
        if (error instanceof ZodError) {
            const fields: Record<string, string[]> = {}
            for (const issue of error.issues) (fields[issue.path.join('.')] ??= []).push(issue.message)
            const controls = controlErrors(fields)
            setErrors(controls)
            setNotice('Проверьте отмеченные поля. Введённые данные сохранены в форме.')
            requestAnimationFrame(() => document.getElementById(Object.keys(controls)[0])?.focus())
        } else if (error instanceof ApiError) {
            const controls = controlErrors(error.fieldErrors)
            setErrors(controls)
            setProblem(error.status)
            setNotice(
                error.status === 401
                    ? 'Сессия завершилась. Войдите в отдельной вкладке и повторите сохранение.'
                    : error.message,
            )
            requestAnimationFrame(() => document.getElementById(Object.keys(controls)[0])?.focus())
        } else
            setNotice(
                'Не удалось подтвердить сохранение. Проверьте соединение и повторите попытку; данные остались в форме.',
            )
    }
    async function findSaved() {
        try {
            return await apiRequest<AdminCarRecord>('/api/cars/' + id)
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) return null
            throw error
        }
    }
    function matches(record: AdminCarRecord, attempt: Attempt) {
        return (
            record.version === (attempt.version ?? 0) + 1 &&
            record.status === attempt.data.status &&
            snapshot(editorValues(record)) === snapshot(editorValues(attempt.data))
        )
    }
    async function save(target: CarStatus) {
        if (busy.current || uploading || !ready || recovery) return
        busy.current = true
        setSaving(target)
        setNotice('')
        setProblem(null)
        setErrors({})
        let attempt: Attempt | null = null
        try {
            // Reconcile an uncertain previous request before attempting another mutation.
            if (pending) {
                const stored = await findSaved()
                if (!mounted.current) return
                if (stored && matches(stored, pending)) {
                    accept(stored, false)
                    setNotice(
                        'Предыдущее сохранение подтверждено. Если вы изменили форму, сохраните изменения ещё раз.',
                    )
                    return
                }
                if (stored && stored.version !== pending.version)
                    throw new ApiError(
                        'Запись уже изменилась. Откройте актуальную версию для сравнения.',
                        409,
                    )
                setPending(null)
            }
            const data = parseCarInput({
                ...values,
                status: target,
                specs: {
                    ...values.specs,
                    features: values.specs.features?.map((feature) => feature.trim()).filter(Boolean),
                },
            })
            // Also handles a restored new form whose successful POST response was lost.
            if (version === null) {
                const stored = await findSaved()
                if (!mounted.current) return
                if (stored) {
                    accept(stored, false)
                    setNotice(
                        'Найдена ранее сохранённая запись. Проверьте данные и сохраните оставшиеся изменения.',
                    )
                    return
                }
            }
            attempt = { data, version }
            setPending(attempt)
            const record = await apiRequest<AdminCarRecord>(
                version === null ? '/api/cars' : '/api/cars/' + id,
                {
                    method: version === null ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, id, ...(version === null ? {} : { version }) }),
                },
            )
            accept(record, true)
        } catch (error) {
            if (!mounted.current) return
            if (attempt && (!(error instanceof ApiError) || error.status >= 500)) {
                try {
                    const stored = await findSaved()
                    if (stored && matches(stored, attempt)) {
                        accept(stored, true)
                        return
                    }
                    if (!stored || stored.version === attempt.version) setPending(null)
                    else {
                        showError(
                            new ApiError(
                                'Автомобиль изменён в другой вкладке. Откройте актуальную запись.',
                                409,
                            ),
                        )
                        return
                    }
                } catch {
                    /* Keep the attempt for explicit reconciliation on the next save. */
                }
            } else setPending(null)
            showError(error)
        } finally {
            busy.current = false
            setSaving(null)
        }
    }
    return {
        id,
        version,
        status,
        values,
        setValues,
        saving,
        errors,
        clearError,
        notice,
        problem,
        savedAt,
        dirty,
        ready,
        recovery,
        restoreRecovery,
        discardRecovery,
        discard: discardRecovery,
        save,
    }
}
