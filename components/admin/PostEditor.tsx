'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import type { AdminPost } from '@/shared/lib/server/posts'
import { documentText, type PostDocument } from '@/shared/lib/post-schema'
import { adminDate } from '@/shared/lib/admin-date'
import { Field } from './Field'
import { ConfirmDialog } from './ConfirmDialog'
import { confirmLeave } from './AdminShell'
import { PostContentEditor } from './PostContentEditor'
import { usePostEditor } from './usePostEditor'
import './post-editor.css'

const tabs = ['Статья', 'SEO', 'Публикация']
function localPublicationTime(value: string) {
    const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Vladivostok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date(value))
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((item) => item.type === type)?.value
    return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}
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
    const [tab, setTab] = useState(0)
    const [focused, setFocused] = useState(false)
    const [slugTouched, setSlugTouched] = useState(!!post?.slug)
    const [coverError, setCoverError] = useState('')
    const [publicationMode, setPublicationMode] = useState<'now' | 'schedule'>(
        post?.scheduled_at ? 'schedule' : 'now',
    )
    const [scheduledTime, setScheduledTime] = useState(
        post?.scheduled_at ? localPublicationTime(post.scheduled_at) : '',
    )
    const [scheduleError, setScheduleError] = useState('')
    const [confirmation, setConfirmation] = useState<
        'hide' | 'restore' | 'delete' | 'publish' | 'cancelSchedule' | null
    >(null)
    const { values, record, dirty, busy, ready, recovery } = state
    const disabled = busy || uploading || !ready || !!recovery
    const addressLocked = !!(record?.published_at || record?.scheduled_at)
    useEffect(() => {
        const first = Object.keys(state.errors)[0]
            ?.replace(/^document\./, '')
            .split('.')[0]
        if (!first) return
        const tabForField: Record<string, number> = {
            title: 0,
            author: 0,
            tags: 0,
            slug: 1,
            excerpt: 0,
            cover: 0,
            coverAlt: 0,
            content: 0,
            seoTitle: 1,
            seoDescription: 1,
            scheduledAt: 2,
        }
        let active = true
        const frame = requestAnimationFrame(() => {
            if (!active) return
            setTab(tabForField[first] ?? 2)
            setFocused(false)
            requestAnimationFrame(() => {
                if (active)
                    document
                        .getElementById(
                            first === 'scheduledAt'
                                ? 'post-scheduledAt'
                                : 'post-' + first,
                        )
                        ?.focus()
            })
        })
        return () => {
            active = false
            cancelAnimationFrame(frame)
        }
    }, [state.errors])
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
        hint?: string,
    ) {
        const props = {
            id: 'post-' + key,
            name: key,
            autoComplete: 'off',
            placeholder:
                key === 'title'
                    ? 'Например, Geely Monjaro: комплектации и стоимость…'
                    : undefined,
            value: values.document[key],
            maxLength: max,
            'aria-invalid': !!fieldError(key),
            'aria-describedby': fieldError(key)
                ? 'post-' + key + '-error'
                : hint
                  ? 'post-' + key + '-hint'
                  : undefined,
            onChange: (
                event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                >,
            ) => {
                update(key, event.target.value)
                if (key === 'title' && !slugTouched && !addressLocked)
                    state.setValues((current) => ({
                        ...current,
                        slug: slugify(event.target.value),
                    }))
            },
        }
        return (
            <Field
                name={'post-' + key}
                label={label}
                error={fieldError(key)}
                hint={hint}
            >
                {textarea ? (
                    <textarea {...props} rows={key === 'title' ? 2 : 4} />
                ) : (
                    <input {...props} />
                )}
            </Field>
        )
    }
    async function publish() {
        if (publicationMode === 'schedule') {
            const date = new Date(scheduledTime + ':00+10:00')
            if (
                !scheduledTime ||
                !Number.isFinite(date.getTime()) ||
                date.getTime() < Date.now() + 60000
            ) {
                setScheduleError(
                    'Выберите время не менее чем через одну минуту по Владивостоку.',
                )
                setTab(2)
                requestAnimationFrame(() =>
                    document.getElementById('post-scheduledAt')?.focus(),
                )
                return
            }
            setScheduleError('')
            await state.action('schedule', date.toISOString())
        } else if (record?.scheduled_at) setConfirmation('publish')
        else await state.action('publish')
    }
    const title = values.document.seoTitle || values.document.title
    const description =
        values.document.seoDescription || values.document.excerpt
    const text = documentText(values.document.content)
    const warnings = [
        title.length < 30 || title.length > 70
            ? 'Заголовок для поиска: ориентир 30–70 символов.'
            : '',
        description.length < 80 || description.length > 180
            ? 'Описание для поиска: ориентир 80–180 символов.'
            : '',
        /"alt":""/.test(JSON.stringify(values.document.content))
            ? 'Добавьте описание фотографий — оно помогает читателям и поиску.'
            : '',
        !JSON.stringify(values.document.content).includes('"heading"')
            ? 'Разделите длинный текст заголовками разделов и подзаголовками.'
            : '',
        !/"href":"\/(?!\/)/.test(JSON.stringify(values.document.content))
            ? 'Добавьте полезную ссылку на каталог или услугу.'
            : '',
    ].filter(Boolean)
    const statusLabel =
        record?.status === 'published'
            ? 'Опубликована'
            : record?.status === 'hidden'
              ? 'Скрыта'
              : 'Черновик'
    return (
        <>
            <div className="admin-titlebar post-page-heading">
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
                    <h1>{record ? 'Редактор статьи' : 'Новая статья'}</h1>
                    <p className="admin-muted">
                        Подготовьте текст, проверьте оформление и выпустите
                        статью. Сохранение черновика не меняет публикацию на
                        сайте.
                    </p>
                </div>
                <div className="post-heading-status">
                    <span className="admin-badge">{statusLabel}</span>
                    {record?.scheduled_at && (
                        <span className="admin-badge admin-badge-warning">
                            Публикация по расписанию
                        </span>
                    )}
                </div>
            </div>
            {recovery && (
                <section
                    className="admin-panel post-recovery"
                    aria-label="Восстановление статьи"
                >
                    <h2>Есть несохранённый текст</h2>
                    <p>
                        Восстановить локальную копию из этой вкладки?
                        Опубликованная статья от этого не изменится.
                    </p>
                    <div className="post-toolbar">
                        <button
                            type="button"
                            className="admin-button admin-button-primary"
                            onClick={state.restoreRecovery}
                        >
                            Восстановить
                        </button>
                        <button
                            type="button"
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
                    className="admin-panel post-problem"
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
                <p role="status" className="post-notice">
                    {state.notice}
                </p>
            )}
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void state.save()
                }}
                className="post-workspace"
            >
                <TabGroup selectedIndex={tab} onChange={setTab}>
                    <TabList className="post-tabs" aria-label="Разделы статьи">
                        {tabs.map((label) => (
                            <Tab key={label} type="button">
                                {label}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="admin-panel post-tab-panels">
                        <TabPanel unmount={false}>
                            <fieldset
                                disabled={disabled}
                                className="post-article-layout"
                                data-focused={focused}
                            >
                                <div className="post-writing-sheet">
                                    <div className="post-document-title">
                                        {textField(
                                            'title',
                                            'Заголовок статьи',
                                            200,
                                            true,
                                        )}
                                    </div>
                                    <div className="post-writing-heading">
                                        <h2>Текст статьи</h2>
                                        <button
                                            type="button"
                                            className="admin-button"
                                            aria-pressed={focused}
                                            onClick={() => setFocused(!focused)}
                                        >
                                            {focused
                                                ? 'Показать настройки'
                                                : 'Развернуть редактор'}
                                        </button>
                                    </div>
                                    <PostContentEditor
                                        value={values.document.content}
                                        onChange={(value) =>
                                            update('content', value)
                                        }
                                        disabled={disabled}
                                        onUploading={setUploading}
                                    />
                                    {fieldError('content') && (
                                        <p
                                            id="post-content-error"
                                            role="alert"
                                            className="admin-field-error"
                                        >
                                            {fieldError('content')}
                                        </p>
                                    )}
                                    <div className="post-article-count">
                                        <span>
                                            {text.trim().length} символов
                                        </span>
                                        <span>
                                            Примерно{' '}
                                            {Math.max(
                                                1,
                                                Math.ceil(
                                                    text.trim().split(/\s+/)
                                                        .length / 180,
                                                ),
                                            )}{' '}
                                            мин чтения
                                        </span>
                                    </div>
                                </div>
                                <aside
                                    className="post-inspector"
                                    aria-label="Настройки статьи"
                                    hidden={focused}
                                >
                                    <section className="post-inspector-section">
                                        <h2>Анонс и обложка</h2>
                                        <p className="admin-muted">
                                            Так читатель увидит статью в блоге и
                                            новостях.
                                        </p>
                                        <div
                                            className="post-announcement-preview"
                                            aria-label="Предпросмотр анонса"
                                        >
                                            {values.document.cover ? (
                                                <div className="post-cover-preview">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={
                                                            values.document
                                                                .cover
                                                        }
                                                        alt={
                                                            values.document
                                                                .coverAlt ||
                                                            'Обложка статьи'
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <div className="post-cover-placeholder">
                                                    Добавьте обложку статьи
                                                </div>
                                            )}
                                            <div>
                                                <strong>
                                                    {values.document.title ||
                                                        'Заголовок статьи'}
                                                </strong>
                                                <p>
                                                    {values.document.excerpt ||
                                                        'Короткий анонс для читателя'}
                                                </p>
                                            </div>
                                        </div>
                                        <Field
                                            name="post-cover"
                                            label={
                                                values.document.cover
                                                    ? 'Заменить обложку'
                                                    : 'Файл обложки'
                                            }
                                            hint="JPG, PNG или WebP, до 10 МБ."
                                            error={
                                                coverError ||
                                                fieldError('cover')
                                            }
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
                                            false,
                                            'Опишите автомобиль и ракурс. Это помогает поиску и людям, которые не видят изображение.',
                                        )}
                                        {values.document.cover && (
                                            <button
                                                type="button"
                                                className="admin-button"
                                                onClick={() =>
                                                    update('cover', '')
                                                }
                                            >
                                                Убрать обложку
                                            </button>
                                        )}
                                        {textField(
                                            'excerpt',
                                            'Краткое описание',
                                            500,
                                            true,
                                            'В 1–2 предложениях: что читатель узнает из статьи.',
                                        )}
                                    </section>
                                    <section className="post-inspector-section">
                                        <h2>Сведения о статье</h2>
                                        {textField('author', 'Автор', 150)}
                                        <Field
                                            name="post-tags"
                                            label="Теги через запятую"
                                            hint="Например: Geely, комплектации, доставка. До 10 тегов."
                                            error={fieldError('tags')}
                                        >
                                            <input
                                                id="post-tags"
                                                name="tags"
                                                key={`${record?.version || 0}:${!!recovery}`}
                                                defaultValue={values.document.tags.join(
                                                    ', ',
                                                )}
                                                maxLength={500}
                                                onChange={(event) =>
                                                    update(
                                                        'tags',
                                                        event.target.value
                                                            .split(',')
                                                            .map((tag) =>
                                                                tag.trim(),
                                                            )
                                                            .filter(Boolean),
                                                    )
                                                }
                                            />
                                        </Field>
                                    </section>
                                </aside>
                            </fieldset>
                        </TabPanel>
                        <TabPanel unmount={false}>
                            <fieldset
                                disabled={disabled}
                                className="post-tab-form"
                            >
                                <div className="post-section-heading">
                                    <h2>Отображение в поиске</h2>
                                    <p>
                                        SEO-поля помогают описать статью для
                                        поисковых систем и социальных сетей.
                                    </p>
                                </div>
                                <Field
                                    name="post-slug"
                                    label="Адрес страницы"
                                    hint={
                                        addressLocked
                                            ? 'Адрес закреплён после публикации или постановки в расписание.'
                                            : 'Предлагается по заголовку. Латинские буквы, цифры и дефисы.'
                                    }
                                    error={fieldError('slug')}
                                >
                                    <div className="post-slug-input">
                                        <span>asiamotors.su/blog/</span>
                                        <input
                                            id="post-slug"
                                            name="slug"
                                            spellCheck={false}
                                            autoComplete="off"
                                            value={values.slug}
                                            maxLength={120}
                                            readOnly={addressLocked}
                                            onChange={(event) => {
                                                setSlugTouched(true)
                                                state.setValues((current) => ({
                                                    ...current,
                                                    slug: event.target.value,
                                                }))
                                            }}
                                        />
                                    </div>
                                </Field>
                                <div className="post-seo-layout">
                                    <div className="post-field-stack">
                                        {textField(
                                            'seoTitle',
                                            'Заголовок для поиска',
                                            200,
                                            false,
                                            'Если оставить пустым, используем заголовок статьи.',
                                        )}
                                        {textField(
                                            'seoDescription',
                                            'Описание для поиска',
                                            500,
                                            true,
                                            'Если оставить пустым, используем краткое описание.',
                                        )}
                                    </div>
                                    <div>
                                        <p className="post-preview-label">
                                            Пример поискового результата
                                        </p>
                                        <div
                                            className="post-search-preview"
                                            role="region"
                                            aria-label="Пример поискового результата"
                                        >
                                            <small>
                                                asiamotors.su › blog ›{' '}
                                                {values.slug || 'adres-stati'}
                                            </small>
                                            <strong>
                                                {title || 'Заголовок статьи'}
                                            </strong>
                                            <p>
                                                {description ||
                                                    'Краткое описание появится здесь.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <p className="admin-muted">
                                    Заголовок для поиска: {title.length}{' '}
                                    символов · Описание: {description.length}{' '}
                                    символов. Поисковая система может показать
                                    собственный фрагмент текста.
                                </p>
                                {warnings.length > 0 && (
                                    <div className="post-seo-hints">
                                        <h3>Рекомендации</h3>
                                        <ul>
                                            {warnings.map((warning) => (
                                                <li key={warning}>{warning}</li>
                                            ))}
                                        </ul>
                                        <p className="admin-muted">
                                            Это рекомендации по оформлению. Они
                                            не гарантируют позиции в поиске.
                                        </p>
                                    </div>
                                )}
                            </fieldset>
                        </TabPanel>
                        <TabPanel unmount={false}>
                            <fieldset
                                disabled={disabled}
                                className="post-tab-form"
                            >
                                <div className="post-section-heading">
                                    <h2>Публикация</h2>
                                    <p>
                                        Сначала сохраните черновик и проверьте
                                        предпросмотр. Затем опубликуйте сейчас
                                        или выберите время.
                                    </p>
                                </div>
                                <section
                                    className="post-publication-checklist"
                                    role="region"
                                    aria-label="Подготовка к публикации"
                                >
                                    <h3>Перед публикацией</h3>
                                    <ul>
                                        {[
                                            {
                                                field: 'title',
                                                label: 'Заголовок статьи',
                                                done: !!values.document.title.trim(),
                                            },
                                            {
                                                field: 'content',
                                                label: 'Текст статьи: не менее 50 символов',
                                                done: text.trim().length >= 50,
                                            },
                                            {
                                                field: 'excerpt',
                                                label: 'Краткое описание',
                                                done: !!values.document.excerpt.trim(),
                                            },
                                            {
                                                field: 'cover',
                                                label: 'Обложка',
                                                done: !!values.document.cover,
                                            },
                                            {
                                                field: 'coverAlt',
                                                label: 'Описание обложки',
                                                done: !!values.document.coverAlt.trim(),
                                            },
                                            {
                                                field: 'author',
                                                label: 'Автор',
                                                done: !!values.document.author.trim(),
                                            },
                                            {
                                                field: 'slug',
                                                label: 'Адрес страницы',
                                                done: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
                                                    values.slug,
                                                ),
                                            },
                                        ].map(({ field, label, done }) => (
                                            <li
                                                key={field}
                                                data-complete={done}
                                            >
                                                <span aria-hidden="true">
                                                    {done ? '✓' : '○'}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label={`${label}: ${done ? 'заполнено' : 'нужно заполнить'}`}
                                                    onClick={() => {
                                                        setTab(
                                                            field === 'slug'
                                                                ? 1
                                                                : 0,
                                                        )
                                                        setFocused(false)
                                                        requestAnimationFrame(
                                                            () =>
                                                                document
                                                                    .getElementById(
                                                                        'post-' +
                                                                            field,
                                                                    )
                                                                    ?.focus(),
                                                        )
                                                    }}
                                                >
                                                    {label}
                                                    <span className="sr-only">
                                                        {done
                                                            ? ': заполнено'
                                                            : ': нужно заполнить'}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="admin-muted">
                                        Нажмите на пункт, чтобы перейти к полю.
                                        Перед выпуском проверьте факты, цены и
                                        условия поставки.
                                    </p>
                                </section>
                                <div className="post-publication-summary">
                                    <strong>{statusLabel}</strong>
                                    {record?.published_at && (
                                        <p>
                                            Первая публикация:{' '}
                                            {adminDate(record.published_at)}
                                        </p>
                                    )}
                                    {record?.hasChanges && (
                                        <p>Есть неопубликованные изменения</p>
                                    )}
                                    {record?.scheduled_at && (
                                        <div className="post-scheduled-info">
                                            <strong>
                                                Запланировано:{' '}
                                                {adminDate(record.scheduled_at)}
                                            </strong>
                                            <p>
                                                В это время выйдет версия,
                                                сохранённая при постановке в
                                                расписание. Более поздние правки
                                                останутся в черновике.
                                            </p>
                                            <button
                                                type="button"
                                                className="admin-button"
                                                disabled={disabled || dirty}
                                                onClick={() =>
                                                    setConfirmation(
                                                        'cancelSchedule',
                                                    )
                                                }
                                            >
                                                Отменить расписание
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <fieldset className="post-publication-mode">
                                    <legend>Когда опубликовать</legend>
                                    <label>
                                        <input
                                            type="radio"
                                            name="publication-mode"
                                            checked={publicationMode === 'now'}
                                            onChange={() =>
                                                setPublicationMode('now')
                                            }
                                        />
                                        Сейчас, после нажатия кнопки публикации
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="publication-mode"
                                            checked={
                                                publicationMode === 'schedule'
                                            }
                                            onChange={() =>
                                                setPublicationMode('schedule')
                                            }
                                        />
                                        В указанное время
                                    </label>
                                </fieldset>
                                {publicationMode === 'schedule' && (
                                    <Field
                                        name="post-scheduledAt"
                                        label="Дата и время (Владивосток, UTC+10)"
                                        hint="Время не зависит от часового пояса вашего устройства."
                                        error={
                                            scheduleError ||
                                            fieldError('scheduledAt')
                                        }
                                    >
                                        <input
                                            id="post-scheduledAt"
                                            type="datetime-local"
                                            value={scheduledTime}
                                            onChange={(event) => {
                                                setScheduledTime(
                                                    event.target.value,
                                                )
                                                setScheduleError('')
                                            }}
                                        />
                                    </Field>
                                )}
                                <label className="post-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={values.document.showCta}
                                        onChange={(event) =>
                                            update(
                                                'showCta',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    Показывать блок «Рассчитать стоимость» и
                                    ссылку на каталог после текста
                                </label>
                                <div className="post-secondary-actions">
                                    {record?.status === 'published' && (
                                        <button
                                            type="button"
                                            className="admin-button"
                                            disabled={disabled || dirty}
                                            onClick={() =>
                                                setConfirmation('hide')
                                            }
                                        >
                                            Скрыть с сайта
                                        </button>
                                    )}
                                    {record?.status === 'hidden' && (
                                        <button
                                            type="button"
                                            className="admin-button"
                                            disabled={disabled || dirty}
                                            onClick={() =>
                                                setConfirmation('restore')
                                            }
                                        >
                                            Вернуть на сайт
                                        </button>
                                    )}
                                    {record && !record.published_at && (
                                        <button
                                            type="button"
                                            className="admin-button admin-button-danger"
                                            disabled={disabled || dirty}
                                            onClick={() =>
                                                setConfirmation('delete')
                                            }
                                        >
                                            Удалить черновик
                                        </button>
                                    )}
                                </div>
                            </fieldset>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
                <div className="post-savebar">
                    <div className="post-save-status">
                        <strong>
                            {uploading
                                ? 'Загрузка фотографии…'
                                : dirty
                                  ? 'Есть несохранённые изменения'
                                  : record
                                    ? 'Все изменения сохранены'
                                    : 'Новая статья'}
                        </strong>
                        <small>
                            {record
                                ? 'Сохранено: ' + adminDate(record.updated_at)
                                : 'Для первого сохранения достаточно заголовка.'}
                        </small>
                        {dirty && (
                            <small>
                                Сохраните черновик перед предпросмотром и
                                публикацией.
                            </small>
                        )}
                    </div>
                    <div className="post-save-actions">
                        <button
                            type="submit"
                            className="admin-button"
                            aria-label={
                                busy ? 'Подождите…' : 'Сохранить черновик'
                            }
                            disabled={disabled}
                        >
                            {busy ? (
                                'Подождите…'
                            ) : (
                                <>
                                    <span className="post-action-full">
                                        Сохранить черновик
                                    </span>
                                    <span className="post-action-short">
                                        Сохранить
                                    </span>
                                </>
                            )}
                        </button>
                        {record && (
                            <a
                                href={'/admin/blog/preview/' + record.id}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-button"
                                aria-label="Предпросмотр сохранённого"
                            >
                                <span className="post-action-full">
                                    Предпросмотр сохранённого
                                </span>
                                <span className="post-action-short">
                                    Предпросмотр
                                </span>
                            </a>
                        )}
                        <button
                            type="button"
                            className="admin-button admin-button-primary"
                            disabled={disabled || dirty || !record}
                            onClick={() => void publish()}
                        >
                            {publicationMode === 'schedule'
                                ? record?.scheduled_at
                                    ? 'Изменить расписание'
                                    : 'Запланировать публикацию'
                                : record?.published_at
                                  ? 'Опубликовать изменения'
                                  : 'Опубликовать'}
                        </button>
                    </div>
                </div>
            </form>
            <ConfirmDialog
                open={!!confirmation}
                title={
                    confirmation === 'delete'
                        ? 'Удалить черновик?'
                        : confirmation === 'hide'
                          ? 'Скрыть статью с сайта?'
                          : confirmation === 'restore'
                            ? 'Вернуть статью на сайт?'
                            : confirmation === 'publish'
                              ? 'Опубликовать сейчас?'
                              : 'Отменить публикацию по расписанию?'
                }
                description={
                    confirmation === 'restore'
                        ? 'Будет показана последняя опубликованная версия. Новые правки останутся в черновике.'
                        : confirmation === 'publish'
                          ? 'Статья будет опубликована сейчас. Запланированная публикация отменится.'
                          : record?.scheduled_at && confirmation === 'hide'
                            ? 'Статья будет скрыта. Запланированная публикация также отменится.'
                            : values.document.title
                }
                confirmLabel={
                    confirmation === 'delete'
                        ? 'Удалить'
                        : confirmation === 'hide'
                          ? 'Скрыть'
                          : confirmation === 'restore'
                            ? 'Вернуть'
                            : confirmation === 'publish'
                              ? 'Опубликовать сейчас'
                              : 'Отменить расписание'
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
