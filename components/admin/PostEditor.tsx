'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminPost } from '@/shared/lib/server/posts'
import { documentText, type PostDocument } from '@/shared/lib/post-schema'
import { Field } from './Field'
import { ConfirmDialog } from './ConfirmDialog'
import { confirmLeave } from './AdminShell'
import { PostContentEditor } from './PostContentEditor'
import { usePostEditor } from './usePostEditor'
import './post-editor.css'

function slugify(value: string) {
    const alphabet: Record<string, string> = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'e',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
    }
    return value
        .toLowerCase()
        .split('')
        .map((char) => alphabet[char] ?? char)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 120)
}
export function PostEditor({
    post,
    returnTo,
}: {
    post?: AdminPost
    returnTo: string
}) {
    const [uploading, setUploading] = useState(false)
    const state = usePostEditor(post, uploading)
    const router = useRouter()
    const [slugTouched, setSlugTouched] = useState(!!post?.slug)
    const [coverError, setCoverError] = useState('')
    const [confirmation, setConfirmation] = useState<
        'hide' | 'restore' | 'delete' | null
    >(null)
    const { values, record, dirty, busy, ready, recovery } = state
    const disabled = busy || uploading || !ready || !!recovery
    function update<K extends keyof PostDocument>(
        key: K,
        value: PostDocument[K],
    ) {
        state.setValues((current) => ({
            ...current,
            document: { ...current.document, [key]: value },
        }))
    }
    const fieldError = (key: string) =>
        state.errors['document.' + key]?.[0] || state.errors[key]?.[0]
    async function uploadCover(file?: File) {
        if (!file) return
        setUploading(true)
        setCoverError('')
        try {
            const body = new FormData()
            body.set('file', file)
            const response = await fetch('/api/uploads', {
                method: 'POST',
                body,
            })
            const result = await response.json()
            if (!response.ok)
                throw new Error(result.error || 'Не удалось загрузить обложку')
            update('cover', result.url)
        } catch (error) {
            setCoverError(
                error instanceof Error
                    ? error.message
                    : 'Не удалось загрузить обложку',
            )
        } finally {
            setUploading(false)
        }
    }
    const title = values.document.seoTitle || values.document.title
    const description =
        values.document.seoDescription || values.document.excerpt
    const text = documentText(values.document.content)
    const warnings = [
        title.length < 30 || title.length > 70
            ? 'Для поискового заголовка обычно удобно 30–70 символов.'
            : '',
        description.length < 80 || description.length > 180
            ? 'Описание для поиска: ориентир 80–180 символов.'
            : '',
        !JSON.stringify(values.document.content).includes('"heading"')
            ? 'Разделите длинный текст заголовками H2 и H3.'
            : '',
        !/"href":"\/(?!\/)/.test(JSON.stringify(values.document.content))
            ? 'Добавьте полезную внутреннюю ссылку на каталог или услугу.'
            : '',
        /"alt":""/.test(JSON.stringify(values.document.content))
            ? 'У некоторых фотографий не заполнено описание alt.'
            : '',
    ].filter(Boolean)
    function textField(
        key:
            | 'title'
            | 'excerpt'
            | 'author'
            | 'coverAlt'
            | 'seoTitle'
            | 'seoDescription',
        label: string,
        max: number,
        textarea = false,
    ) {
        const input = {
            id: 'post-' + key,
            value: values.document[key],
            maxLength: max,
            'aria-invalid': !!fieldError(key),
            onChange: (
                event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                >,
            ) => {
                update(key, event.target.value)
                if (key === 'title' && !slugTouched && !record?.published_at)
                    state.setValues((current) => ({
                        ...current,
                        slug: slugify(event.target.value),
                    }))
            },
        }
        return (
            <Field name={'post-' + key} label={label} error={fieldError(key)}>
                {textarea ? (
                    <textarea {...input} rows={3} />
                ) : (
                    <input {...input} />
                )}
            </Field>
        )
    }
    return (
        <>
            <div className="admin-titlebar">
                <div>
                    <Link
                        href={returnTo}
                        onNavigate={(event) => {
                            if ((dirty || uploading) && !confirmLeave())
                                event.preventDefault()
                        }}
                    >
                        ← К статьям
                    </Link>
                    <h1>{record ? 'Редактирование статьи' : 'Новая статья'}</h1>
                    <p className="admin-muted">
                        Подготовьте материал, проверьте предпросмотр и
                        опубликуйте отдельным действием.
                    </p>
                </div>
                <span className="admin-badge">
                    {record?.status === 'published'
                        ? 'Опубликована'
                        : record?.status === 'hidden'
                          ? 'Скрыта'
                          : 'Черновик'}
                </span>
            </div>
            {recovery && (
                <section
                    className="admin-panel"
                    aria-label="Восстановление статьи"
                >
                    <h2>Есть несохранённый текст</h2>
                    <p>
                        Восстановить локальную копию из этой вкладки? Публикация
                        на сайте от этого не изменится.
                    </p>
                    <div className="post-toolbar">
                        <button
                            className="admin-button admin-button-primary"
                            onClick={state.restoreRecovery}
                        >
                            Восстановить
                        </button>
                        <button
                            className="admin-button"
                            onClick={state.discardRecovery}
                        >
                            Не восстанавливать
                        </button>
                    </div>
                </section>
            )}
            {state.problem && (
                <div
                    className="admin-panel"
                    role="alert"
                    id="post-problem"
                    tabIndex={-1}
                >
                    <p>{state.problem}</p>
                    {state.status === 401 && (
                        <a
                            href="/auth/signin"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Войти в новой вкладке, затем повторить
                        </a>
                    )}
                    {state.status === 409 && (
                        <a
                            href={'/admin/blog/edit/' + state.id}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Открыть актуальную запись отдельно
                        </a>
                    )}
                </div>
            )}
            {state.notice && (
                <p role="status" className="admin-notice">
                    {state.notice}
                </p>
            )}
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void state.save()
                }}
            >
                <fieldset disabled={disabled} className="post-editor-layout">
                    <div className="post-editor-main">
                        <section className="admin-panel post-editor-section">
                            <h2>Основное</h2>
                            {textField('title', 'Заголовок статьи', 200)}
                            {textField(
                                'excerpt',
                                'Краткое описание',
                                500,
                                true,
                            )}
                            <div className="post-metadata-grid">
                                {textField('author', 'Автор', 150)}
                                <Field
                                    name="post-tags"
                                    label="Теги через запятую"
                                >
                                    <input
                                        id="post-tags"
                                        key={
                                            record?.version ||
                                            String(!!recovery)
                                        }
                                        defaultValue={values.document.tags.join(
                                            ', ',
                                        )}
                                        maxLength={500}
                                        onChange={(event) =>
                                            update(
                                                'tags',
                                                event.target.value
                                                    .split(',')
                                                    .map((tag) => tag.trim())
                                                    .filter(Boolean),
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                        </section>
                        <section className="admin-panel post-editor-section">
                            <h2>Текст статьи</h2>
                            <PostContentEditor
                                value={values.document.content}
                                onChange={(value) => update('content', value)}
                                disabled={disabled}
                                onUploading={setUploading}
                            />
                            {fieldError('content') && (
                                <p className="admin-field-error">
                                    {fieldError('content')}
                                </p>
                            )}
                            <p className="admin-muted">
                                {text.length} символов · примерно{' '}
                                {Math.max(
                                    1,
                                    Math.ceil(text.split(/\s+/).length / 180),
                                )}{' '}
                                мин чтения
                            </p>
                        </section>
                    </div>
                    <aside className="post-editor-sidebar">
                        <section className="admin-panel post-editor-section">
                            <h2>Обложка</h2>
                            {values.document.cover && (
                                <div className="post-cover-preview">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={values.document.cover}
                                        alt={
                                            values.document.coverAlt ||
                                            'Обложка статьи'
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="admin-button"
                                        onClick={() => update('cover', '')}
                                    >
                                        Убрать обложку
                                    </button>
                                </div>
                            )}
                            <Field
                                name="post-cover"
                                label="Файл обложки"
                                hint="JPG, PNG или WebP, до 10 МБ"
                                error={coverError || fieldError('cover')}
                            >
                                <input
                                    id="post-cover"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => {
                                        void uploadCover(
                                            event.target.files?.[0],
                                        )
                                        event.target.value = ''
                                    }}
                                />
                            </Field>
                            {textField(
                                'coverAlt',
                                'Что изображено на обложке (alt)',
                                300,
                            )}
                        </section>
                        <section className="admin-panel post-editor-section">
                            <h2>SEO и адрес</h2>
                            <Field
                                name="post-slug"
                                label="Адрес страницы"
                                hint={
                                    record?.published_at
                                        ? 'После первой публикации адрес закреплён.'
                                        : 'Латинские буквы, цифры и дефисы. Проверьте до публикации.'
                                }
                                error={fieldError('slug')}
                            >
                                <input
                                    id="post-slug"
                                    value={values.slug}
                                    maxLength={120}
                                    readOnly={!!record?.published_at}
                                    onChange={(event) => {
                                        setSlugTouched(true)
                                        state.setValues((current) => ({
                                            ...current,
                                            slug: event.target.value,
                                        }))
                                    }}
                                />
                            </Field>
                            {textField('seoTitle', 'Заголовок для поиска', 200)}
                            {textField(
                                'seoDescription',
                                'Описание для поиска',
                                500,
                                true,
                            )}
                            <p className="admin-muted">
                                Пустые SEO-поля используют заголовок и краткое
                                описание статьи.
                            </p>
                            <div
                                className="post-search-preview"
                                aria-label="Пример поискового результата"
                            >
                                <small>
                                    asiamotors.su › blog ›{' '}
                                    {values.slug || 'adres-stati'}
                                </small>
                                <strong>{title || 'Заголовок статьи'}</strong>
                                <p>
                                    {description ||
                                        'Краткое описание появится здесь.'}
                                </p>
                            </div>
                            {warnings.length > 0 && (
                                <details>
                                    <summary>
                                        Подсказки перед публикацией (
                                        {warnings.length})
                                    </summary>
                                    <ul>
                                        {warnings.map((warning) => (
                                            <li key={warning}>{warning}</li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                        </section>
                        <section className="admin-panel post-editor-section">
                            <h2>Блок заявки</h2>
                            <label className="post-checkbox">
                                <input
                                    type="checkbox"
                                    checked={values.document.showCta}
                                    onChange={(event) =>
                                        update('showCta', event.target.checked)
                                    }
                                />
                                Показывать «Рассчитать стоимость» и ссылку на
                                каталог
                            </label>
                            <p className="admin-muted">
                                Блок размещается после текста и использует
                                существующую форму заявок.
                            </p>
                        </section>
                    </aside>
                </fieldset>
                <div className="admin-panel post-savebar">
                    <div>
                        <strong>
                            {uploading
                                ? 'Загрузка фотографии…'
                                : dirty
                                  ? 'Есть несохранённые изменения'
                                  : record
                                    ? 'Все изменения сохранены'
                                    : 'Новая статья'}
                        </strong>
                        {record && (
                            <p className="admin-muted">
                                Сохранено:{' '}
                                {new Intl.DateTimeFormat('ru-RU', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                    timeZone: 'Asia/Vladivostok',
                                }).format(new Date(record.updated_at))}
                            </p>
                        )}
                        {record?.hasChanges && (
                            <p>Есть неопубликованные изменения</p>
                        )}
                    </div>
                    <div className="post-toolbar">
                        <button
                            type="submit"
                            className="admin-button"
                            disabled={disabled}
                        >
                            {busy ? 'Подождите…' : 'Сохранить черновик'}
                        </button>
                        {record && (
                            <a
                                href={'/admin/blog/preview/' + record.id}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-button"
                            >
                                Предпросмотр сохранённого
                            </a>
                        )}
                        <button
                            type="button"
                            className="admin-button admin-button-primary"
                            disabled={disabled || dirty || !record}
                            onClick={() => void state.action('publish')}
                        >
                            {record?.published_at
                                ? 'Опубликовать изменения'
                                : 'Опубликовать'}
                        </button>
                        {record?.status === 'published' && (
                            <button
                                type="button"
                                className="admin-button"
                                disabled={disabled || dirty}
                                onClick={() => setConfirmation('hide')}
                            >
                                Скрыть с сайта
                            </button>
                        )}
                        {record?.status === 'hidden' && (
                            <button
                                type="button"
                                className="admin-button"
                                disabled={disabled || dirty}
                                onClick={() => setConfirmation('restore')}
                            >
                                Вернуть на сайт
                            </button>
                        )}
                        {record && !record.published_at && (
                            <button
                                type="button"
                                className="admin-button admin-button-danger"
                                disabled={disabled || dirty}
                                onClick={() => setConfirmation('delete')}
                            >
                                Удалить черновик
                            </button>
                        )}
                    </div>
                    {dirty && (
                        <p className="admin-muted">
                            Перед предпросмотром и публикацией сохраните
                            черновик. Посетители пока видят прежнюю
                            опубликованную версию.
                        </p>
                    )}
                </div>
            </form>
            <ConfirmDialog
                open={!!confirmation}
                title={
                    confirmation === 'delete'
                        ? 'Удалить черновик?'
                        : confirmation === 'hide'
                          ? 'Скрыть статью с сайта?'
                          : 'Вернуть статью на сайт?'
                }
                description={
                    confirmation === 'restore'
                        ? 'Будет показана последняя опубликованная версия. Новые правки останутся в черновике.'
                        : values.document.title
                }
                confirmLabel={
                    confirmation === 'delete'
                        ? 'Удалить'
                        : confirmation === 'hide'
                          ? 'Скрыть'
                          : 'Вернуть'
                }
                pending={busy}
                onClose={() => setConfirmation(null)}
                onConfirm={async () => {
                    if (confirmation && (await state.action(confirmation))) {
                        const deleted = confirmation === 'delete'
                        setConfirmation(null)
                        if (deleted) router.push(returnTo)
                    }
                }}
            />
        </>
    )
}
