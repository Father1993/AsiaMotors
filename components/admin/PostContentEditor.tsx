'use client'

import { useEffect, useRef, useState } from 'react'
import {
    EditorContent,
    useEditor,
    useEditorState,
    type JSONContent,
    type Editor,
} from '@tiptap/react'
import type { SelectionBookmark } from '@tiptap/pm/state'
import { closeHistory } from '@tiptap/pm/history'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Description,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import {
    LinkIcon,
    PhotoIcon,
    TableCellsIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ListBulletIcon,
    NumberedListIcon,
} from '@heroicons/react/24/outline'
import { apiRequest } from '@/shared/lib/catalog-client'
import { safePostLink, type DocumentNode } from '@/shared/lib/post-schema'

const ArticleImage = Image.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            'figure',
            {
                'data-article-image': '',
                title: 'Выберите фотографию и нажмите «Изменить фото» в панели редактора',
            },
            ['img', HTMLAttributes],
            ...(HTMLAttributes['data-caption']
                ? [['figcaption', {}, String(HTMLAttributes['data-caption'])]]
                : []),
        ]
    },
    parseHTML() {
        return [
            {
                tag: 'figure[data-article-image]',
                getAttrs: (element) => {
                    const image = element.querySelector('img')
                    if (
                        !image ||
                        !/^\/media\/[0-9a-f-]{36}\.webp$/.test(
                            image.getAttribute('src') || '',
                        )
                    )
                        return false
                    return {
                        src: image.getAttribute('src'),
                        alt: image.getAttribute('alt') || '',
                        title: image.getAttribute('title'),
                        caption: image.getAttribute('data-caption') || '',
                    }
                },
            },
            {
                tag: 'img[src]',
                getAttrs: (element) =>
                    /^\/media\/[0-9a-f-]{36}\.webp$/.test(
                        element.getAttribute('src') || '',
                    )
                        ? null
                        : false,
            },
        ]
    },
    addAttributes() {
        return {
            ...this.parent?.(),
            caption: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-caption'),
                renderHTML: (attrs) => ({ 'data-caption': attrs.caption }),
            },
        }
    },
})
// Store only the documented node attributes; pasted Word markup never becomes HTML in storage.
function cleanNode(node: JSONContent): DocumentNode {
    const allowed: Record<string, string[]> = {
        heading: ['level'],
        orderedList: ['start'],
        image: ['src', 'alt', 'title', 'caption'],
        tableCell: ['colspan', 'rowspan', 'colwidth'],
        tableHeader: ['colspan', 'rowspan', 'colwidth'],
    }
    const attrs = Object.fromEntries(
        Object.entries(node.attrs || {}).filter(
            ([key, value]) =>
                allowed[node.type || '']?.includes(key) && value !== null,
        ),
    )
    return {
        type: node.type || 'paragraph',
        ...(node.text !== undefined ? { text: node.text } : {}),
        ...(Object.keys(attrs).length ? { attrs } : {}),
        ...(node.content ? { content: node.content.map(cleanNode) } : {}),
        ...(node.marks?.length
            ? {
                  marks: node.marks.map((mark) => ({
                      type: mark.type,
                      ...(mark.type === 'link'
                          ? { attrs: { href: mark.attrs?.href } }
                          : {}),
                  })),
              }
            : {}),
    } as DocumentNode
}
function toolbarState(editor: Editor | null) {
    return editor
        ? {
              empty: editor.isEmpty,
              style: editor.isActive('heading', { level: 2 })
                  ? 'h2'
                  : editor.isActive('heading', { level: 3 })
                    ? 'h3'
                    : 'paragraph',
              bold: editor.isActive('bold'),
              italic: editor.isActive('italic'),
              bullet: editor.isActive('bulletList'),
              ordered: editor.isActive('orderedList'),
              quote: editor.isActive('blockquote'),
              image: editor.isActive('image'),
              link: editor.isActive('link'),
              table: editor.isActive('table'),
              undo: editor.can().undo(),
              redo: editor.can().redo(),
          }
        : null
}
export function PostContentEditor({
    value,
    onChange,
    disabled,
    onUploading,
}: {
    value: DocumentNode
    onChange: (value: DocumentNode) => void
    disabled: boolean
    onUploading: (value: boolean) => void
}) {
    const [dialog, setDialog] = useState<'link' | 'image' | null>(null)
    const [href, setHref] = useState('')
    const [linkText, setLinkText] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imageAlt, setImageAlt] = useState('')
    const [caption, setCaption] = useState('')
    const [editingImage, setEditingImage] = useState(false)
    const [problem, setProblem] = useState('')
    const [uploading, setUploading] = useState(false)
    const selection = useRef<SelectionBookmark | null>(null)
    const originalLinkText = useRef('')
    const mounted = useRef(true)
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                code: false,
                codeBlock: false,
                strike: false,
                underline: false,
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    autolink: false,
                    linkOnPaste: false,
                },
            }),
            ArticleImage.configure({ allowBase64: false }),
            TableKit.configure({ table: { resizable: false } }),
        ],
        content: value as JSONContent,
        editorProps: {
            attributes: {
                class: 'post-rich-content',
                role: 'textbox',
                'aria-label': 'Текст статьи',
                'aria-multiline': 'true',
                'aria-describedby': 'post-writing-help',
                lang: 'ru',
                id: 'post-content',
            },
            transformPastedHTML(html) {
                // Keep local media only; Word styles and unsupported nodes are discarded by the schema parser.
                const template = document.createElement('template')
                template.innerHTML = html
                template.content.querySelectorAll('img').forEach((image) => {
                    if (
                        !/^\/media\/[0-9a-f-]{36}\.webp$/.test(
                            image.getAttribute('src') || '',
                        )
                    )
                        image.remove()
                })
                return template.innerHTML
            },
        },
        onUpdate: ({ editor }) => onChange(cleanNode(editor.getJSON())),
    })
    const selected = useEditorState({
        editor,
        selector: ({ editor }) => toolbarState(editor),
    })
    const current = selected || toolbarState(editor)
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])
    useEffect(() => {
        editor?.setEditable(!disabled && !uploading, false)
    }, [editor, disabled, uploading])
    useEffect(() => {
        if (editor && !editor.state.doc.eq(editor.schema.nodeFromJSON(value)))
            editor.commands.setContent(value as JSONContent, {
                emitUpdate: false,
            })
    }, [editor, value])
    function rememberSelection() {
        if (editor) selection.current = editor.state.selection.getBookmark()
    }
    function restoreSelection() {
        if (!editor) return
        const bookmark = selection.current
        if (bookmark)
            editor.commands.command(({ tr }) => {
                tr.setSelection(bookmark.resolve(tr.doc))
                return true
            })
    }
    function openLink() {
        if (!editor) return
        if (editor.isActive('link')) editor.commands.extendMarkRange('link')
        rememberSelection()
        const { from, to } = editor.state.selection
        setHref(editor.getAttributes('link').href || '')
        originalLinkText.current = editor.state.doc.textBetween(from, to, ' ')
        setLinkText(originalLinkText.current)
        setProblem('')
        setDialog('link')
    }
    function openImage() {
        if (!editor) return
        rememberSelection()
        const existing = editor.isActive('image')
        const attrs = existing ? editor.getAttributes('image') : {}
        setEditingImage(existing)
        setImageUrl(attrs.src || '')
        setImageAlt(attrs.alt || '')
        setCaption(attrs.caption || '')
        setProblem('')
        setDialog('image')
    }
    function closeDialog() {
        if (uploading) return
        setDialog(null)
        setProblem('')
        requestAnimationFrame(() => {
            if (editor && !editor.isDestroyed) {
                restoreSelection()
                editor.commands.focus()
            }
        })
    }
    async function upload(file?: File) {
        if (!file) return
        setUploading(true)
        onUploading(true)
        setProblem('')
        try {
            const body = new FormData()
            body.set('file', file)
            const result = await apiRequest<{ url: string }>('/api/uploads', {
                method: 'POST',
                body,
            })
            if (mounted.current) setImageUrl(result.url)
        } catch (error) {
            if (mounted.current)
                setProblem(
                    error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить фотографию. Повторите загрузку.',
                )
        } finally {
            if (mounted.current) setUploading(false)
            onUploading(false)
        }
    }
    function historyBoundary() {
        if (editor) editor.view.dispatch(closeHistory(editor.state.tr))
    }
    function applyDialog() {
        if (!editor || uploading) return
        if (dialog === 'link') {
            if (!safePostLink(href.trim()) || !linkText.trim()) {
                setProblem(
                    'Укажите текст и адрес ссылки: https://… или путь /catalog.',
                )
                return
            }
            restoreSelection()
            historyBoundary()
            if (
                linkText === originalLinkText.current &&
                !editor.state.selection.empty
            ) {
                editor.chain().focus().setLink({ href: href.trim() }).run()
            } else {
                const marks = (
                    editor.state.storedMarks ||
                    editor.state.selection.$from.marks()
                )
                    .filter((mark) =>
                        ['bold', 'italic'].includes(mark.type.name),
                    )
                    .map((mark) => ({ type: mark.type.name }))
                editor
                    .chain()
                    .focus()
                    .insertContent({
                        type: 'text',
                        text: linkText,
                        marks: [
                            ...marks,
                            { type: 'link', attrs: { href: href.trim() } },
                        ],
                    })
                    .run()
            }
        } else {
            if (!imageUrl) {
                setProblem('Сначала выберите и загрузите фотографию.')
                return
            }
            restoreSelection()
            historyBoundary()
            if (editingImage)
                editor
                    .chain()
                    .focus()
                    .updateAttributes('image', {
                        src: imageUrl,
                        alt: imageAlt.trim(),
                        caption: caption.trim(),
                    })
                    .run()
            else
                editor
                    .chain()
                    .focus()
                    .setImage({ src: imageUrl, alt: imageAlt.trim() })
                    .updateAttributes('image', { caption: caption.trim() })
                    .run()
        }
        historyBoundary()
        setDialog(null)
        setProblem('')
    }
    if (!editor || !current)
        return <p className="admin-muted">Загрузка редактора…</p>
    const tableCommands = [
        [
            'Вставить таблицу 3 × 3',
            () =>
                editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
            false,
        ],
        [
            'Добавить строку ниже',
            () => editor.chain().focus().addRowAfter().run(),
            true,
        ],
        [
            'Добавить столбец справа',
            () => editor.chain().focus().addColumnAfter().run(),
            true,
        ],
        [
            'Сделать строку заголовком',
            () => editor.chain().focus().toggleHeaderRow().run(),
            true,
        ],
        [
            'Удалить строку',
            () => editor.chain().focus().deleteRow().run(),
            true,
        ],
        [
            'Удалить столбец',
            () => editor.chain().focus().deleteColumn().run(),
            true,
        ],
        [
            'Удалить таблицу',
            () => editor.chain().focus().deleteTable().run(),
            true,
        ],
    ] as const
    return (
        <div className="post-editor-content">
            <div
                className="post-format-toolbar"
                role="toolbar"
                aria-label="Форматирование текста"
                onKeyDown={(event) => {
                    if (
                        event.target instanceof HTMLSelectElement ||
                        !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
                            event.key,
                        )
                    )
                        return
                    const controls = Array.from(
                        event.currentTarget.querySelectorAll<
                            HTMLButtonElement | HTMLSelectElement
                        >('button:not(:disabled), select:not(:disabled)'),
                    )
                    const index = controls.indexOf(
                        event.target as HTMLButtonElement,
                    )
                    if (index < 0) return
                    event.preventDefault()
                    controls[
                        event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? controls.length - 1
                              : (index +
                                    (event.key === 'ArrowRight' ? 1 : -1) +
                                    controls.length) %
                                controls.length
                    ]?.focus()
                }}
            >
                <div className="post-tool-group">
                    <label className="sr-only" htmlFor="post-text-style">
                        Стиль текста
                    </label>
                    <select
                        id="post-text-style"
                        value={current.style}
                        disabled={disabled}
                        onChange={(event) => {
                            const chain = editor.chain().focus()
                            if (event.target.value === 'paragraph')
                                chain.setParagraph().run()
                            else
                                chain
                                    .toggleHeading({
                                        level:
                                            event.target.value === 'h2' ? 2 : 3,
                                    })
                                    .run()
                        }}
                    >
                        <option value="paragraph">Обычный текст</option>
                        <option value="h2">Заголовок раздела</option>
                        <option value="h3">Подзаголовок</option>
                    </select>
                </div>
                <div
                    className="post-tool-group"
                    role="group"
                    aria-label="Начертание"
                >
                    <button
                        type="button"
                        title="Полужирный · Ctrl+B"
                        aria-label="Полужирный"
                        aria-pressed={current.bold}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                    >
                        <strong aria-hidden="true">Ж</strong>
                        <span>Жирный</span>
                    </button>
                    <button
                        type="button"
                        title="Курсив · Ctrl+I"
                        aria-label="Курсив"
                        aria-pressed={current.italic}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                    >
                        <em aria-hidden="true">К</em>
                        <span>Курсив</span>
                    </button>
                </div>
                <div
                    className="post-tool-group"
                    role="group"
                    aria-label="Списки и цитата"
                >
                    <button
                        type="button"
                        title="Маркированный список"
                        aria-label="Маркированный список"
                        aria-pressed={current.bullet}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <ListBulletIcon aria-hidden="true" />
                        <span>Список</span>
                    </button>
                    <button
                        type="button"
                        title="Нумерованный список"
                        aria-label="Нумерованный список"
                        aria-pressed={current.ordered}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <NumberedListIcon aria-hidden="true" />
                        <span>Нумерация</span>
                    </button>
                    <button
                        type="button"
                        title="Цитата"
                        aria-label="Цитата"
                        aria-pressed={current.quote}
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                    >
                        <span>Цитата</span>
                    </button>
                </div>
                <div
                    className="post-tool-group"
                    role="group"
                    aria-label="Вставить в статью"
                >
                    <button
                        type="button"
                        disabled={disabled}
                        aria-label={
                            current.link ? 'Изменить ссылку' : 'Вставить ссылку'
                        }
                        title={
                            current.link ? 'Изменить ссылку' : 'Добавить ссылку'
                        }
                        onClick={openLink}
                    >
                        <LinkIcon aria-hidden="true" />
                        <span>
                            {current.link ? 'Изменить ссылку' : 'Ссылка'}
                        </span>
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        aria-label={
                            current.image
                                ? 'Изменить фотографию'
                                : 'Вставить фотографию'
                        }
                        title={
                            current.image
                                ? 'Изменить фотографию'
                                : 'Добавить фотографию'
                        }
                        onClick={openImage}
                    >
                        <PhotoIcon aria-hidden="true" />
                        <span>{current.image ? 'Изменить фото' : 'Фото'}</span>
                    </button>
                    <Menu>
                        <MenuButton
                            type="button"
                            disabled={disabled}
                            onClick={rememberSelection}
                            onKeyDown={(event) => {
                                if (
                                    [
                                        'Enter',
                                        ' ',
                                        'ArrowDown',
                                        'ArrowUp',
                                    ].includes(event.key)
                                )
                                    rememberSelection()
                            }}
                            title="Таблица"
                        >
                            <TableCellsIcon aria-hidden="true" />
                            <span>Таблица</span>
                        </MenuButton>
                        <MenuItems
                            anchor="bottom start"
                            className="admin-shell post-table-menu"
                        >
                            {tableCommands.map(
                                ([label, command, requiresTable]) => (
                                    <MenuItem
                                        key={label}
                                        as="button"
                                        type="button"
                                        disabled={
                                            requiresTable && !current.table
                                        }
                                        onClick={() => {
                                            restoreSelection()
                                            command()
                                        }}
                                    >
                                        {label}
                                    </MenuItem>
                                ),
                            )}
                        </MenuItems>
                    </Menu>
                </div>
                <div
                    className="post-tool-group"
                    role="group"
                    aria-label="Очистка оформления"
                >
                    <button
                        type="button"
                        title="Убрать оформление выделенного текста"
                        aria-label="Очистить оформление"
                        disabled={disabled}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .unsetAllMarks()
                                .clearNodes()
                                .run()
                        }
                    >
                        <span>Без стилей</span>
                    </button>
                </div>
                <div
                    className="post-tool-group"
                    role="group"
                    aria-label="История изменений"
                >
                    <button
                        type="button"
                        title="Отменить · Ctrl+Z"
                        aria-label="Отменить действие"
                        disabled={disabled || !current.undo}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <ArrowUturnLeftIcon aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        title="Повторить · Ctrl+Shift+Z"
                        aria-label="Повторить действие"
                        disabled={disabled || !current.redo}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <ArrowUturnRightIcon aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div className="post-editor-surface" data-empty={current.empty}>
                {current.empty && (
                    <div
                        className="post-writing-placeholder"
                        aria-hidden="true"
                    >
                        <strong>Начните с короткого вступления…</strong>
                        <p>
                            Напишите, какую задачу решит статья: выбрать
                            автомобиль, сравнить комплектации или разобраться в
                            доставке.
                        </p>
                        <p>
                            Можно вставить готовый текст из Word, а затем
                            добавить заголовки, фотографии и таблицы.
                        </p>
                    </div>
                )}
                <EditorContent editor={editor} />
            </div>
            <div className="post-content-status" id="post-writing-help">
                <span>
                    Выделите текст, чтобы изменить оформление или добавить
                    ссылку. Для фото и таблицы поставьте курсор в нужное место.
                </span>
                <span>Ctrl+B · Ctrl+I · Ctrl+Z</span>
            </div>
            <Dialog
                open={!!dialog}
                onClose={closeDialog}
                className="admin-shell admin-confirm-root"
            >
                <DialogBackdrop className="admin-confirm-backdrop" />
                <div className="admin-confirm-container">
                    <DialogPanel className="admin-panel post-edit-dialog">
                        <DialogTitle as="h2">
                            {dialog === 'link'
                                ? 'Ссылка в статье'
                                : editingImage
                                  ? 'Изменить фотографию'
                                  : 'Добавить фотографию'}
                        </DialogTitle>
                        <Description className="admin-muted">
                            {dialog === 'link'
                                ? 'Ссылка будет добавлена в том месте, где находилось выделение.'
                                : 'Фотографии хранятся на сервере сайта. Изменения карточки применятся после сохранения статьи.'}
                        </Description>
                        <div className="post-dialog-fields">
                            {dialog === 'link' ? (
                                <>
                                    <label>
                                        Текст ссылки
                                        <input
                                            data-autofocus
                                            value={linkText}
                                            maxLength={1000}
                                            onChange={(event) =>
                                                setLinkText(event.target.value)
                                            }
                                        />
                                    </label>
                                    <label>
                                        Адрес ссылки
                                        <input
                                            type="text"
                                            inputMode="url"
                                            value={href}
                                            maxLength={2048}
                                            placeholder="https://… или /catalog"
                                            onChange={(event) =>
                                                setHref(event.target.value)
                                            }
                                        />
                                    </label>
                                    {current.link && (
                                        <button
                                            type="button"
                                            className="admin-button"
                                            onClick={() => {
                                                restoreSelection()
                                                historyBoundary()
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .unsetLink()
                                                    .run()
                                                historyBoundary()
                                                setDialog(null)
                                            }}
                                        >
                                            Убрать ссылку
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {imageUrl && (
                                        <div className="post-dialog-photo">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    imageAlt ||
                                                    'Выбранная фотография'
                                                }
                                            />
                                        </div>
                                    )}
                                    <label>
                                        Фотография
                                        <input
                                            data-autofocus
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            disabled={uploading}
                                            onChange={(event) => {
                                                void upload(
                                                    event.target.files?.[0],
                                                )
                                                event.target.value = ''
                                            }}
                                        />
                                    </label>
                                    <p className="admin-muted">
                                        JPG, PNG или WebP, до 10 МБ.
                                    </p>
                                    <label>
                                        Что изображено на фотографии (alt)
                                        <input
                                            value={imageAlt}
                                            maxLength={300}
                                            onChange={(event) =>
                                                setImageAlt(event.target.value)
                                            }
                                        />
                                    </label>
                                    <label>
                                        Подпись под фотографией
                                        <input
                                            value={caption}
                                            maxLength={500}
                                            onChange={(event) =>
                                                setCaption(event.target.value)
                                            }
                                        />
                                    </label>
                                    {editingImage && (
                                        <button
                                            type="button"
                                            className="admin-button admin-button-danger"
                                            disabled={uploading}
                                            onClick={() => {
                                                restoreSelection()
                                                historyBoundary()
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .deleteSelection()
                                                    .run()
                                                historyBoundary()
                                                setDialog(null)
                                            }}
                                        >
                                            Удалить фотографию из текста
                                        </button>
                                    )}
                                </>
                            )}
                            {uploading && (
                                <p role="status">Фотография загружается…</p>
                            )}
                            {problem && (
                                <p role="alert" className="admin-field-error">
                                    {problem}
                                </p>
                            )}
                        </div>
                        <div className="admin-confirm-actions">
                            <button
                                type="button"
                                className="admin-button"
                                disabled={uploading}
                                onClick={closeDialog}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="admin-button admin-button-primary"
                                disabled={uploading}
                                onClick={applyDialog}
                            >
                                {dialog === 'link'
                                    ? 'Применить ссылку'
                                    : editingImage
                                      ? 'Сохранить фотографию'
                                      : 'Вставить фотографию'}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}
