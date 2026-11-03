'use client'

import { useEffect, useRef, useState } from 'react'
import { ApiError, apiRequest } from '@/shared/lib/catalog-client'
import { documentSchema, type PostDocument } from '@/shared/lib/post-schema'
import type { AdminPost } from '@/shared/lib/server/posts'
import { useAdminNavigation } from './AdminShell'

type Values = { slug: string; document: PostDocument }
const empty: PostDocument = {
    title: '',
    excerpt: '',
    author: 'AsiaMotors',
    cover: '',
    coverAlt: '',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    showCta: true,
    content: { type: 'doc', content: [{ type: 'paragraph' }] },
}
const snapshot = (values: Values) =>
    JSON.stringify(values, (_key, value) =>
        value && typeof value === 'object' && !Array.isArray(value)
            ? Object.fromEntries(
                  Object.keys(value)
                      .sort()
                      .map((key) => [key, value[key]]),
              )
            : value,
    )
export const postRecoveryPrefix = 'asiamotors:post:'

export function usePostEditor(initial?: AdminPost, uploading = false) {
    const [id, setId] = useState(initial?.id || '')
    const [record, setRecord] = useState(initial)
    const [values, setValues] = useState<Values>({
        slug: initial?.slug || '',
        document: initial?.draft || empty,
    })
    const [baseline, setBaseline] = useState(() => snapshot(values))
    const [recovery, setRecovery] = useState<{
        id: string
        values: Values
        version: number | null
    } | null>(null)
    const [ready, setReady] = useState(false)
    const [busy, setBusy] = useState(false)
    const [notice, setNotice] = useState('')
    const [problem, setProblem] = useState('')
    const [status, setStatus] = useState<number | null>(null)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const mounted = useRef(true)
    const locked = useRef(false)
    const { setDirty } = useAdminNavigation()
    const dirty = snapshot(values) !== baseline
    const key = postRecoveryPrefix + (record?.id || initial?.id || 'new')
    useEffect(() => {
        mounted.current = true
        setId((current) => current || crypto.randomUUID())
        try {
            const cached = JSON.parse(sessionStorage.getItem(key) || 'null')
            if (
                cached &&
                /^[0-9a-f-]{36}$/.test(cached.id) &&
                typeof cached.values?.slug === 'string' &&
                documentSchema.safeParse({
                    ...cached.values.document,
                    title:
                        cached.values.document?.title ||
                        'Восстановленная статья',
                }).success
            )
                setRecovery(cached)
        } catch {
            /* Browser storage is optional. */
        }
        setReady(true)
        return () => {
            mounted.current = false
        }
    }, [key])
    useEffect(() => {
        if (!ready || recovery) return
        try {
            if (dirty)
                sessionStorage.setItem(
                    key,
                    JSON.stringify({
                        id,
                        values,
                        version: record?.version ?? null,
                    }),
                )
            else sessionStorage.removeItem(key)
        } catch {
            /* Saving to PostgreSQL remains available. */
        }
    }, [ready, recovery, dirty, id, values, key, record?.version])
    useEffect(() => {
        setDirty(dirty || busy || uploading)
        return () => setDirty(false)
    }, [dirty, busy, uploading, setDirty])
    useEffect(() => {
        if (!dirty && !busy) return
        const warn = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ''
        }
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
    }, [dirty, busy])
    const accept = (next: AdminPost, message: string) => {
        if (!mounted.current) return
        setRecord(next)
        setValues({ slug: next.slug || '', document: next.draft })
        setBaseline(snapshot({ slug: next.slug || '', document: next.draft }))
        setNotice(message)
        setStatus(null)
        try {
            sessionStorage.removeItem(key)
        } catch {
            /* Optional storage. */
        }
        // Keep the editor mounted so that keyboard focus and history are preserved.
        if (!initial)
            window.history.replaceState(
                null,
                '',
                '/admin/blog/edit/' + next.id + window.location.search,
            )
    }
    async function save() {
        if (locked.current || !ready || recovery || !id) return false
        locked.current = true
        setBusy(true)
        setProblem('')
        setErrors({})
        setNotice('')
        const submitted = structuredClone(values)
        try {
            const next = await apiRequest<AdminPost>(
                '/api/admin/posts' + (record ? '/' + id : ''),
                {
                    method: record ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...submitted,
                        ...(record ? { version: record.version } : { id }),
                    }),
                },
            )
            if (
                !record &&
                snapshot({ slug: next.slug || '', document: next.draft }) !==
                    snapshot({
                        ...submitted,
                        document: documentSchema.parse(submitted.document),
                    })
            ) {
                if (mounted.current) {
                    try {
                        sessionStorage.removeItem(key)
                    } catch {
                        /* Optional storage. */
                    }
                    setRecord(next)
                    setBaseline(
                        snapshot({
                            slug: next.slug || '',
                            document: next.draft,
                        }),
                    )
                    setNotice(
                        'Запись уже создана предыдущей попыткой. Введённые правки сохранены в форме; нажмите «Сохранить черновик» ещё раз.',
                    )
                }
                return false
            }
            accept(next, 'Черновик сохранён')
            return true
        } catch (error) {
            // An interrupted response can follow a successful commit. Inspect before retrying.
            if (!(error instanceof ApiError) || error.status >= 500) {
                try {
                    const current = await apiRequest<AdminPost>(
                        '/api/admin/posts/' + id,
                    )
                    if (
                        snapshot({
                            slug: current.slug || '',
                            document: current.draft,
                        }) === snapshot(submitted)
                    ) {
                        accept(current, 'Сохранение подтверждено')
                        return true
                    }
                } catch {
                    /* Keep local input and show the original error. */
                }
            }
            showError(error)
            return false
        } finally {
            locked.current = false
            if (mounted.current) setBusy(false)
        }
    }
    function showError(error: unknown) {
        if (!mounted.current) return
        setProblem(
            error instanceof Error
                ? error.message
                : 'Не удалось выполнить действие',
        )
        if (error instanceof ApiError) {
            setStatus(error.status)
            setErrors(error.fieldErrors)
            requestAnimationFrame(() => {
                const first = Object.keys(error.fieldErrors)[0]?.replace(
                    /^document\./,
                    '',
                )
                const control =
                    first && document.getElementById('post-' + first)
                ;(control || document.getElementById('post-problem'))?.focus()
            })
        }
    }
    async function action(action: 'publish' | 'hide' | 'restore' | 'delete') {
        if (!record || locked.current || dirty) return false
        locked.current = true
        setBusy(true)
        setProblem('')
        setErrors({})
        setNotice('')
        try {
            const result = await apiRequest<AdminPost>(
                '/api/admin/posts/' + id,
                {
                    method: action === 'delete' ? 'DELETE' : 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        version: record.version,
                        ...(action === 'delete' ? {} : { action }),
                    }),
                },
            )
            if (action !== 'delete')
                accept(
                    result,
                    action === 'publish'
                        ? 'Статья опубликована'
                        : action === 'hide'
                          ? 'Статья скрыта с сайта'
                          : 'Статья возвращена на сайт',
                )
            return true
        } catch (error) {
            showError(error)
            return false
        } finally {
            locked.current = false
            if (mounted.current) setBusy(false)
        }
    }
    function restoreRecovery() {
        if (!recovery) return
        setValues(recovery.values)
        if (
            record &&
            Number.isInteger(recovery.version) &&
            recovery.version !== null
        )
            setRecord({ ...record, version: recovery.version })
        if (!initial) setId(recovery.id)
        setRecovery(null)
    }
    function discardRecovery() {
        try {
            sessionStorage.removeItem(key)
        } catch {
            /* Optional storage. */
        }
        setRecovery(null)
    }
    return {
        id,
        record,
        values,
        setValues,
        dirty,
        busy,
        ready,
        recovery,
        restoreRecovery,
        discardRecovery,
        save,
        action,
        notice,
        problem,
        status,
        errors,
    }
}
