'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import type { AdminCarRecord, CountryId, CountryRecord } from '@/shared/types/database.types'
import { categories, fuelTypes, driveTypes } from '@/shared/types/catalog'
import { formatPrice, generateCarSlug } from '@/shared/utils/catalog'
import { confirmLeave } from './AdminShell'
import { Field } from './Field'
import { CarPhotos } from './CarPhotos'
import { useCarEditor, type EditorValues } from './useCarEditor'

import { CarStatusBadge } from './CarStatus'
export function CarEditor({
    car,
    countries,
    returnTo,
}: {
    car?: AdminCarRecord
    countries: CountryRecord[]
    returnTo: string
}) {
    const [uploading, setUploading] = useState(false)
    const editor = useCarEditor(car, uploading)
    const { values, setValues, errors, saving, status } = editor
    const blocked = !!saving || uploading || !editor.ready || !!editor.recovery
    function change<K extends keyof EditorValues>(name: K, value: EditorValues[K]) {
        setValues((previous) => ({ ...previous, [name]: value }))
        editor.clearError(name)
    }
    function spec<K extends keyof EditorValues['specs']>(name: K, value: EditorValues['specs'][K]) {
        setValues((previous) => ({ ...previous, specs: { ...previous.specs, [name]: value } }))
        editor.clearError('specs.' + name)
    }
    function control(name: string, hint = false) {
        return {
            id: name,
            name,
            autoComplete: 'off',
            'aria-invalid': !!errors[name],
            'aria-describedby':
                [hint ? name + '-hint' : '', errors[name] ? name + '-error' : ''].filter(Boolean).join(' ') ||
                undefined,
        }
    }
    const publicLink =
        status === 'published' && editor.version !== null && values.year !== null
            ? '/catalog/' +
              generateCarSlug({ id: editor.id, brand: values.brand, model: values.model, year: values.year })
            : null
    return (
        <>
            <Link
                href={returnTo}
                className="admin-back"
                onNavigate={(event) => {
                    if ((editor.dirty || saving || uploading) && !confirmLeave()) event.preventDefault()
                }}
            >
                ← К автомобилям
            </Link>
            <div className="admin-titlebar">
                <div>
                    <h1>
                        {editor.version === null
                            ? 'Новый автомобиль'
                            : [values.brand, values.model].filter(Boolean).join(' ') ||
                              'Редактирование автомобиля'}
                    </h1>
                    <p className="admin-muted">
                        {editor.version === null
                            ? 'Начните с марки и модели — остальное можно заполнить позже.'
                            : 'Данные, фотографии и публикация автомобиля.'}
                    </p>
                </div>
                <CarStatusBadge status={status} />
            </div>
            {editor.recovery && (
                <div className="admin-panel admin-recovery" role="status">
                    <div>
                        <h2>Есть несохранённые данные</h2>
                        <p className="admin-muted">
                            В этой вкладке осталась копия формы. Её можно восстановить и проверить перед
                            сохранением.
                        </p>
                    </div>
                    <div className="admin-action-row">
                        <button
                            className="admin-button admin-button-primary"
                            onClick={editor.restoreRecovery}
                        >
                            Восстановить
                        </button>
                        <button className="admin-button" onClick={editor.discardRecovery}>
                            Удалить копию
                        </button>
                    </div>
                </div>
            )}
            <form
                noValidate
                onSubmit={(event) => {
                    event.preventDefault()
                    void editor.save(status)
                }}
            >
                <fieldset
                    disabled={!!saving || !editor.ready || !!editor.recovery}
                    className="admin-editor-grid"
                >
                    <legend className="sr-only">Данные автомобиля</legend>
                    <div className="admin-editor-fields">
                        <section className="admin-panel" aria-labelledby="car-main-title">
                            <div className="admin-section-heading">
                                <div>
                                    <h2 id="car-main-title">Основное</h2>
                                    <p className="admin-muted">Марка и модель нужны даже для черновика.</p>
                                </div>
                                <span className="admin-section-number" aria-hidden="true">
                                    01
                                </span>
                            </div>
                            <div className="admin-fields">
                                <Field name="brand" label="Марка *" error={errors.brand?.[0]}>
                                    <input
                                        {...control('brand')}
                                        value={values.brand}
                                        maxLength={150}
                                        required
                                        placeholder="Например, Toyota…"
                                        onChange={(e) => change('brand', e.target.value)}
                                    />
                                </Field>
                                <Field name="model" label="Модель *" error={errors.model?.[0]}>
                                    <input
                                        {...control('model')}
                                        value={values.model}
                                        maxLength={150}
                                        required
                                        placeholder="Например, Camry…"
                                        onChange={(e) => change('model', e.target.value)}
                                    />
                                </Field>
                                <Field name="year" label="Год выпуска" error={errors.year?.[0]}>
                                    <input
                                        {...control('year')}
                                        type="number"
                                        inputMode="numeric"
                                        min={1900}
                                        max={2200}
                                        step={1}
                                        value={values.year ?? ''}
                                        placeholder="Например, 2026…"
                                        onChange={(e) =>
                                            change(
                                                'year',
                                                e.target.value === '' ? null : e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    name="country_id"
                                    label="Страна каталога"
                                    error={errors.country_id?.[0]}
                                >
                                    <select
                                        {...control('country_id')}
                                        value={values.country_id || ''}
                                        onChange={(e) =>
                                            change('country_id', (e.target.value || null) as CountryId | null)
                                        }
                                    >
                                        <option value="">Выберите страну</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field name="category" label="Категория" error={errors.category?.[0]}>
                                    <select
                                        {...control('category')}
                                        value={values.category}
                                        onChange={(e) => change('category', e.target.value)}
                                    >
                                        <option value="">Выберите категорию</option>
                                        {categories
                                            .filter((value) => value !== 'Все')
                                            .map((value) => (
                                                <option key={value}>{value}</option>
                                            ))}
                                        {values.category &&
                                            !categories.some((value) => value === values.category) && (
                                                <option>{values.category}</option>
                                            )}
                                    </select>
                                </Field>
                            </div>
                        </section>
                        <section className="admin-panel" aria-labelledby="car-price-title">
                            <div className="admin-section-heading">
                                <h2 id="car-price-title">Цена и наличие</h2>
                                <span className="admin-section-number" aria-hidden="true">
                                    02
                                </span>
                            </div>
                            <div className="admin-fields">
                                <Field
                                    name="price"
                                    label="Цена, ₽"
                                    hint="Полная стоимость в рублях"
                                    error={errors.price?.[0]}
                                >
                                    <NumericFormat
                                        {...control('price', true)}
                                        value={values.price ?? ''}
                                        thousandSeparator=" "
                                        decimalSeparator=","
                                        allowedDecimalSeparators={['.', ',']}
                                        decimalScale={2}
                                        inputMode="decimal"
                                        placeholder="Например, 2 500 000…"
                                        onValueChange={({ floatValue }, info) => {
                                            if (info.source === 'event') change('price', floatValue ?? null)
                                        }}
                                    />
                                </Field>
                                <Field name="available" label="Наличие">
                                    <select
                                        {...control('available')}
                                        value={String(values.available)}
                                        onChange={(e) => change('available', e.target.value === 'true')}
                                    >
                                        <option value="true">В наличии</option>
                                        <option value="false">Под заказ</option>
                                    </select>
                                </Field>
                            </div>
                        </section>
                        <section className="admin-panel" aria-labelledby="car-specs-title">
                            <div className="admin-section-heading">
                                <div>
                                    <h2 id="car-specs-title">Характеристики</h2>
                                    <p className="admin-muted">
                                        Для публикации заполните все поля этого раздела. Нулевой пробег и
                                        объём допустимы, например для электромобиля.
                                    </p>
                                </div>
                                <span className="admin-section-number" aria-hidden="true">
                                    03
                                </span>
                            </div>
                            <div className="admin-fields">
                                {(
                                    [
                                        ['mileage', 'Пробег, км', 1, 1e8],
                                        ['engineVolume', 'Объём двигателя, л', 0.1, 100],
                                        ['horsePower', 'Мощность, л.с.', 1, 10000],
                                    ] as const
                                ).map(([name, label, step, max]) => (
                                    <Field
                                        key={name}
                                        name={'specs.' + name}
                                        label={label}
                                        error={errors['specs.' + name]?.[0]}
                                    >
                                        <input
                                            {...control('specs.' + name)}
                                            type="number"
                                            inputMode={step === 1 ? 'numeric' : 'decimal'}
                                            min={0}
                                            max={max}
                                            step={step}
                                            value={values.specs[name] ?? ''}
                                            onChange={(e) =>
                                                spec(
                                                    name,
                                                    e.target.value === ''
                                                        ? undefined
                                                        : e.target.valueAsNumber,
                                                )
                                            }
                                        />
                                    </Field>
                                ))}
                                {(
                                    [
                                        ['fuelType', 'Тип топлива', fuelTypes],
                                        [
                                            'transmission',
                                            'Коробка передач',
                                            ['Механика', 'Автомат', 'Робот', 'Вариатор'],
                                        ],
                                        ['driveType', 'Привод', driveTypes],
                                    ] as const
                                ).map(([name, label, options]) => (
                                    <Field
                                        key={name}
                                        name={'specs.' + name}
                                        label={label}
                                        error={errors['specs.' + name]?.[0]}
                                    >
                                        <select
                                            {...control('specs.' + name)}
                                            value={values.specs[name] || ''}
                                            onChange={(e) => spec(name, e.target.value || undefined)}
                                        >
                                            <option value="">Выберите значение</option>
                                            {options.map((option) => (
                                                <option key={option}>{option}</option>
                                            ))}
                                            {values.specs[name] &&
                                                !options.some((option) => option === values.specs[name]) && (
                                                    <option>{values.specs[name]}</option>
                                                )}
                                        </select>
                                    </Field>
                                ))}
                            </div>
                        </section>
                        <section className="admin-panel" aria-labelledby="car-extra-title">
                            <div className="admin-section-heading">
                                <div>
                                    <h2 id="car-extra-title">Дополнительно</h2>
                                    <p className="admin-muted">Эти поля необязательны.</p>
                                </div>
                                <span className="admin-section-number" aria-hidden="true">
                                    04
                                </span>
                            </div>
                            <div className="admin-fields">
                                <Field name="specs.color" label="Цвет" error={errors['specs.color']?.[0]}>
                                    <input
                                        {...control('specs.color')}
                                        value={values.specs.color || ''}
                                        maxLength={150}
                                        onChange={(e) => spec('color', e.target.value)}
                                    />
                                </Field>
                                <Field
                                    name="specs.generation"
                                    label="Поколение"
                                    error={errors['specs.generation']?.[0]}
                                >
                                    <input
                                        {...control('specs.generation')}
                                        value={values.specs.generation || ''}
                                        maxLength={150}
                                        onChange={(e) => spec('generation', e.target.value)}
                                    />
                                </Field>
                            </div>
                            <Field name="equipment" label="Комплектация" error={errors.equipment?.[0]}>
                                <textarea
                                    {...control('equipment')}
                                    rows={4}
                                    value={values.equipment}
                                    maxLength={3000}
                                    onChange={(e) => change('equipment', e.target.value)}
                                />
                            </Field>
                            <Field
                                name="specs.features"
                                label="Особенности"
                                hint="Каждая особенность — с новой строки"
                                error={errors['specs.features']?.[0]}
                            >
                                <textarea
                                    {...control('specs.features', true)}
                                    rows={4}
                                    value={values.specs.features?.join('\n') || ''}
                                    onChange={(e) => spec('features', e.target.value.split('\n'))}
                                />
                            </Field>
                        </section>
                        <CarPhotos
                            images={values.images}
                            disabled={!!saving}
                            error={errors.images?.[0]}
                            onBusy={setUploading}
                            onChange={(images) => change('images', images)}
                            onUploaded={(url) => {
                                setValues((previous) => ({ ...previous, images: [...previous.images, url] }))
                                editor.clearError('images')
                            }}
                        />
                    </div>
                    <aside className="admin-editor-preview">
                        <div className="admin-panel admin-preview-card">
                            <p className="admin-eyebrow">Карточка каталога</p>
                            <div className="admin-preview-photo">
                                {values.images[0] ? (
                                    <Image
                                        src={values.images[0]}
                                        alt="Обложка автомобиля"
                                        fill
                                        sizes="(max-width: 1023px) 90vw, 310px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <span>Добавьте обложку</span>
                                )}
                            </div>
                            <h2>
                                {values.brand || 'Марка'} {values.model || 'Модель'}
                            </h2>
                            <p className="admin-muted">
                                {values.year ?? 'Год не указан'} ·{' '}
                                {values.available ? 'В наличии' : 'Под заказ'}
                            </p>
                            <p className="admin-preview-price">
                                {values.price === null ? 'Цена не указана' : formatPrice(values.price)}
                            </p>
                            <CarStatusBadge status={status} />
                            <p className="admin-muted admin-preview-hint">
                                {status === 'draft'
                                    ? 'Черновик виден только в админке. Посетители увидят автомобиль после публикации.'
                                    : status === 'hidden'
                                      ? 'Автомобиль скрыт с сайта. Фотографии и данные сохранены.'
                                      : 'Сохранённые изменения сразу видны посетителям сайта.'}
                            </p>
                            {publicLink && (
                                <a
                                    href={publicLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-button"
                                >
                                    Открыть на сайте ↗
                                </a>
                            )}
                        </div>
                    </aside>
                </fieldset>
                <div className="admin-editor-footer">
                    <div className="admin-editor-feedback" aria-live="polite">
                        {editor.notice ? (
                            <p
                                className={
                                    editor.problem || Object.keys(errors).length ? 'admin-field-error' : ''
                                }
                            >
                                {editor.notice}
                            </p>
                        ) : (
                            <p className="admin-muted">
                                {editor.dirty
                                    ? 'Есть несохранённые изменения'
                                    : editor.savedAt
                                      ? 'Все изменения сохранены'
                                      : 'Черновик ещё не сохранён'}
                            </p>
                        )}
                        {editor.savedAt && (
                            <p className="admin-muted admin-saved-at">
                                Сохранено:{' '}
                                {new Intl.DateTimeFormat('ru-RU', {
                                    timeZone: 'Asia/Vladivostok',
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(new Date(editor.savedAt))}{' '}
                                (Владивосток)
                            </p>
                        )}
                        {editor.problem === 401 && (
                            <a
                                href="/auth/signin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-text-link"
                            >
                                Войти в отдельной вкладке ↗
                            </a>
                        )}
                        {editor.problem === 409 && (
                            <a
                                href={'/admin/cars/' + editor.id}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-text-link"
                            >
                                Открыть актуальную запись для сравнения ↗
                            </a>
                        )}
                    </div>
                    <div className="admin-action-row">
                        <Link
                            href={returnTo}
                            className="admin-button admin-button-quiet"
                            onNavigate={(event) => {
                                if ((editor.dirty || saving || uploading) && !confirmLeave()) {
                                    event.preventDefault()
                                    return
                                }
                                editor.discard()
                            }}
                        >
                            Отмена
                        </Link>
                        {status === 'draft' ? (
                            <>
                                <button type="submit" className="admin-button" disabled={blocked}>
                                    {saving === 'draft' ? 'Сохранение…' : 'Сохранить черновик'}
                                </button>
                                <button
                                    type="button"
                                    className="admin-button admin-button-primary"
                                    disabled={blocked}
                                    onClick={() => void editor.save('published')}
                                >
                                    {saving === 'published' ? 'Публикация…' : 'Опубликовать'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="admin-button"
                                    disabled={blocked}
                                    onClick={() =>
                                        void editor.save(status === 'published' ? 'hidden' : 'published')
                                    }
                                >
                                    {status === 'published' ? 'Скрыть с сайта' : 'Вернуть на сайт'}
                                </button>
                                <button
                                    type="submit"
                                    className="admin-button admin-button-primary"
                                    disabled={blocked}
                                >
                                    {saving ? 'Сохранение…' : 'Сохранить изменения'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </>
    )
}
