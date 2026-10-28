'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '@/shared/lib/catalog-client'

type Upload = { id: string; file: File; status: 'waiting' | 'uploading' | 'done' | 'failed'; error?: string }
export function CarPhotos({
    images,
    disabled,
    error,
    onChange,
    onUploaded,
    onBusy,
}: {
    images: string[]
    disabled: boolean
    error?: string
    onChange: (images: string[]) => void
    onUploaded: (url: string) => void
    onBusy: (busy: boolean) => void
}) {
    const [queue, setQueue] = useState<Upload[]>([])
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const active = useRef(false)
    const controller = useRef<AbortController | null>(null)
    useEffect(() => () => controller.current?.abort(), [])
    function update(id: string, changes: Partial<Upload>) {
        setQueue((items) => items.map((item) => (item.id === id ? { ...item, ...changes } : item)))
    }
    async function run(items: Upload[], replace: boolean) {
        if (active.current || disabled) return
        if (images.length + items.length > 30) {
            setMessage(`Можно добавить ещё ${30 - images.length} фото. Выберите меньше файлов.`)
            return
        }
        active.current = true
        setUploading(true)
        onBusy(true)
        setMessage('')
        if (replace) setQueue(items)
        controller.current = new AbortController()
        try {
            for (const item of items) {
                update(item.id, { status: 'uploading', error: undefined })
                try {
                    if (item.file.size === 0 || item.file.size > 10 * 1024 * 1024)
                        throw new Error('Допустим непустой файл до 10 МБ.')
                    if (
                        !['image/jpeg', 'image/png', 'image/webp'].includes(item.file.type) &&
                        !/\.(jpe?g|png|webp)$/i.test(item.file.name)
                    )
                        throw new Error('Выберите JPG, PNG или WebP.')
                    const body = new FormData()
                    body.set('file', item.file)
                    const { url } = await apiRequest<{ url: string }>('/api/uploads', {
                        method: 'POST',
                        body,
                        signal: controller.current.signal,
                    })
                    onUploaded(url)
                    update(item.id, { status: 'done' })
                } catch (error) {
                    if (controller.current.signal.aborted) break
                    update(item.id, {
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Не удалось загрузить файл.',
                    })
                }
            }
        } finally {
            active.current = false
            setUploading(false)
            onBusy(false)
        }
    }
    function select(files: FileList | null) {
        if (files)
            void run(
                Array.from(files, (file) => ({ id: crypto.randomUUID(), file, status: 'waiting' as const })),
                true,
            )
    }
    function move(index: number, target: number) {
        const next = [...images]
        const [image] = next.splice(index, 1)
        next.splice(target, 0, image)
        onChange(next)
    }
    return (
        <section className="admin-panel admin-photo-section" aria-labelledby="photos-title">
            <div className="admin-section-heading">
                <div>
                    <h2 id="photos-title">Фотографии</h2>
                    <p className="admin-muted">Первое фото — обложка каталога. {images.length} из 30.</p>
                </div>
            </div>
            <div id="images" tabIndex={-1} aria-describedby={error ? 'images-error' : undefined}>
                {error && (
                    <p id="images-error" className="admin-field-error" role="alert">
                        {error}
                    </p>
                )}
                <div className="admin-photos">
                    {images.map((url, index) => (
                        <article key={url} className="admin-photo">
                            <div className="admin-photo-image">
                                <Image
                                    src={url}
                                    alt={`Фото автомобиля ${index + 1}`}
                                    fill
                                    sizes="(max-width: 767px) 42vw, 240px"
                                    className="object-cover"
                                />
                                <span className="admin-photo-number">
                                    {index === 0 ? 'Обложка' : index + 1}
                                </span>
                            </div>
                            <div className="admin-photo-actions">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        disabled={disabled || uploading}
                                        onClick={() => move(index, 0)}
                                    >
                                        Сделать главным
                                    </button>
                                )}
                                <div>
                                    <button
                                        type="button"
                                        aria-label={`Фото ${index + 1}: раньше`}
                                        disabled={disabled || uploading || index === 0}
                                        onClick={() => move(index, index - 1)}
                                    >
                                        ←
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Фото ${index + 1}: позже`}
                                        disabled={disabled || uploading || index === images.length - 1}
                                        onClick={() => move(index, index + 1)}
                                    >
                                        →
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-photo-remove"
                                        aria-label={`Удалить фото ${index + 1}`}
                                        disabled={disabled || uploading}
                                        onClick={() => onChange(images.filter((_, i) => i !== index))}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <div
                className="admin-dropzone"
                onDragOver={(event) => {
                    event.preventDefault()
                }}
                onDrop={(event) => {
                    event.preventDefault()
                    if (!disabled && !uploading) select(event.dataTransfer.files)
                }}
            >
                <label htmlFor="car-photo-files">Добавить фотографии</label>
                <p className="admin-muted" id="photo-hint">
                    JPG, PNG, WebP · до 10 МБ на файл. На компьютере файлы можно перетащить сюда.
                </p>
                <input
                    id="car-photo-files"
                    name="photos"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    aria-describedby="photo-hint"
                    disabled={disabled || uploading || images.length >= 30}
                    onChange={(event) => {
                        select(event.target.files)
                        event.target.value = ''
                    }}
                />
            </div>
            {message && (
                <p role="alert" className="admin-field-error">
                    {message}
                </p>
            )}
            <div aria-live="polite" className="admin-upload-status">
                {uploading
                    ? 'Загрузка фотографий… Сохранение станет доступно после завершения.'
                    : queue.length > 0
                      ? `Загружено ${queue.filter((item) => item.status === 'done').length} из ${queue.length}. Неудачные загрузки можно повторить.`
                      : ''}
            </div>
            {queue.length > 0 && (
                <ul className="admin-upload-list">
                    {queue.map((item) => (
                        <li key={item.id}>
                            <span className="admin-upload-name">{item.file.name}</span>
                            <span>
                                {item.status === 'done'
                                    ? 'Загружено'
                                    : item.status === 'uploading'
                                      ? 'Загрузка…'
                                      : item.status === 'waiting'
                                        ? 'В очереди'
                                        : item.error}
                            </span>
                            {item.status === 'failed' && (
                                <button
                                    type="button"
                                    className="admin-button"
                                    disabled={disabled || uploading}
                                    onClick={() => void run([item], false)}
                                >
                                    Повторить
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
