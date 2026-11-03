'use client'

import { useEffect, useState } from 'react'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import { apiRequest } from '@/shared/lib/catalog-client'
import { safePostLink, type DocumentNode } from '@/shared/lib/post-schema'

const ArticleImage = Image.extend({
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
    const [imageAlt, setImageAlt] = useState('')
    const [caption, setCaption] = useState('')
    const [href, setHref] = useState('')
    const [uploadError, setUploadError] = useState('')
    const [uploading, setUploading] = useState(false)
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
                id: 'post-content',
            },
        },
        onUpdate: ({ editor }) => onChange(cleanNode(editor.getJSON())),
    })
    useEffect(() => {
        editor?.setEditable(!disabled && !uploading, false)
    }, [editor, disabled, uploading])
    useEffect(() => {
        if (
            editor &&
            JSON.stringify(cleanNode(editor.getJSON())) !==
                JSON.stringify(value)
        )
            editor.commands.setContent(value as JSONContent, {
                emitUpdate: false,
            })
    }, [editor, value])
    useEffect(() => {
        if (!editor) return
        const update = () => {
            const attrs = editor.getAttributes('image')
            if (editor.isActive('image')) {
                setImageAlt(attrs.alt || '')
                setCaption(attrs.caption || '')
            }
        }
        editor.on('selectionUpdate', update)
        return () => {
            editor.off('selectionUpdate', update)
        }
    }, [editor])
    async function upload(file?: File) {
        if (!file || !editor) return
        setUploading(true)
        onUploading(true)
        setUploadError('')
        try {
            const body = new FormData()
            body.set('file', file)
            const result = await apiRequest<{ url: string }>('/api/uploads', {
                method: 'POST',
                body,
            })
            editor
                .chain()
                .focus()
                .setImage({ src: result.url, alt: imageAlt })
                .updateAttributes('image', { caption })
                .run()
        } catch (error) {
            setUploadError(
                error instanceof Error
                    ? error.message
                    : 'Не удалось загрузить фото',
            )
        } finally {
            setUploading(false)
            onUploading(false)
        }
    }
    if (!editor) return <p className="admin-muted">Загрузка редактора…</p>
    const buttons = [
        [
            'Абзац',
            () => editor.chain().focus().setParagraph().run(),
            editor.isActive('paragraph'),
        ],
        [
            'H2',
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            editor.isActive('heading', { level: 2 }),
        ],
        [
            'H3',
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            editor.isActive('heading', { level: 3 }),
        ],
        [
            'Жирный',
            () => editor.chain().focus().toggleBold().run(),
            editor.isActive('bold'),
        ],
        [
            'Курсив',
            () => editor.chain().focus().toggleItalic().run(),
            editor.isActive('italic'),
        ],
        [
            'Список',
            () => editor.chain().focus().toggleBulletList().run(),
            editor.isActive('bulletList'),
        ],
        [
            'Нумерация',
            () => editor.chain().focus().toggleOrderedList().run(),
            editor.isActive('orderedList'),
        ],
        [
            'Цитата',
            () => editor.chain().focus().toggleBlockquote().run(),
            editor.isActive('blockquote'),
        ],
        ['Отменить', () => editor.chain().focus().undo().run(), false],
        ['Повторить', () => editor.chain().focus().redo().run(), false],
    ] as const
    return (
        <div className="post-editor-content">
            <div
                className="post-toolbar"
                role="group"
                aria-label="Форматирование текста"
            >
                {buttons.map(([label, action, active]) => (
                    <button
                        key={label}
                        type="button"
                        className="admin-button"
                        aria-pressed={active}
                        disabled={disabled || uploading}
                        onClick={() => action()}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <details className="post-insert-panel">
                <summary>Ссылка</summary>
                <div className="post-inline-fields">
                    <label>
                        Адрес ссылки
                        <input
                            type="text"
                            inputMode="url"
                            value={href}
                            onChange={(event) => setHref(event.target.value)}
                            placeholder="https://… или /catalog"
                        />
                    </label>
                    <button
                        type="button"
                        className="admin-button"
                        disabled={disabled || !href.trim()}
                        onClick={() => {
                            const url = href.trim()
                            if (!safePostLink(url)) {
                                setUploadError(
                                    'Укажите безопасную ссылку https://… или путь /catalog',
                                )
                                return
                            }
                            editor
                                .chain()
                                .focus()
                                .extendMarkRange('link')
                                .setLink({ href: url })
                                .run()
                        }}
                    >
                        Применить к выделенному тексту
                    </button>
                    <button
                        type="button"
                        className="admin-button"
                        disabled={disabled}
                        onClick={() => editor.chain().focus().unsetLink().run()}
                    >
                        Убрать ссылку
                    </button>
                </div>
            </details>
            <details className="post-insert-panel">
                <summary>Фотография и подпись</summary>
                <div className="post-inline-fields">
                    <label>
                        Описание фотографии (alt)
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
                            onChange={(event) => setCaption(event.target.value)}
                        />
                    </label>
                    <label>
                        Загрузить JPG, PNG или WebP до 10 МБ
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={disabled || uploading}
                            onChange={(event) => {
                                void upload(event.target.files?.[0])
                                event.target.value = ''
                            }}
                        />
                    </label>
                    <button
                        type="button"
                        className="admin-button"
                        disabled={disabled || !editor.isActive('image')}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .updateAttributes('image', {
                                    alt: imageAlt,
                                    caption,
                                })
                                .run()
                        }
                    >
                        Обновить выбранную фотографию
                    </button>
                    <button
                        type="button"
                        className="admin-button"
                        disabled={disabled || !editor.isActive('image')}
                        onClick={() =>
                            editor.chain().focus().deleteSelection().run()
                        }
                    >
                        Удалить выбранную фотографию
                    </button>
                </div>
            </details>
            <details className="post-insert-panel">
                <summary>Таблица сравнения</summary>
                <div className="post-toolbar">
                    <button
                        type="button"
                        className="admin-button"
                        disabled={disabled}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .insertTable({
                                    rows: 3,
                                    cols: 3,
                                    withHeaderRow: true,
                                })
                                .run()
                        }
                    >
                        Вставить таблицу 3 × 3
                    </button>
                    {(
                        [
                            'addRowAfter',
                            'deleteRow',
                            'addColumnAfter',
                            'deleteColumn',
                            'deleteTable',
                        ] as const
                    ).map((command, index) => (
                        <button
                            key={command}
                            type="button"
                            className="admin-button"
                            disabled={disabled || !editor.isActive('table')}
                            onClick={() =>
                                editor.chain().focus()[command]().run()
                            }
                        >
                            {
                                [
                                    'Добавить строку',
                                    'Удалить строку',
                                    'Добавить столбец',
                                    'Удалить столбец',
                                    'Удалить таблицу',
                                ][index]
                            }
                        </button>
                    ))}
                </div>
            </details>
            <EditorContent editor={editor} />
            {uploading && <p role="status">Фотография загружается…</p>}
            {uploadError && (
                <p role="alert" className="admin-field-error">
                    {uploadError} Повторите действие; текст и загруженные
                    изображения сохранены.
                </p>
            )}
            <p className="admin-muted">
                Заголовок статьи станет H1 автоматически. В тексте используйте
                H2 и H3. Вставка из Word очищается от посторонних стилей.
            </p>
        </div>
    )
}
