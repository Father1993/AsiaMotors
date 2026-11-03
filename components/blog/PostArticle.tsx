/* eslint-disable @next/next/no-img-element -- local WebP uploads already processed by Sharp */
import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import {
    documentSchema,
    type DocumentNode,
    type PostDocument,
    safePostLink,
} from '@/shared/lib/post-schema'
import ArticleCta from './ArticleCta'
const text = (n: DocumentNode): string =>
    n.text || n.content?.map(text).join('') || ''
export default function PostArticle({
    document,
    slug,
    publishedAt,
    updatedAt,
    preview = false,
}: {
    document: PostDocument
    slug: string
    publishedAt: string
    updatedAt?: string
    preview?: boolean
}) {
    const doc = documentSchema.parse(document)
    const headings: { id: string; title: string }[] = []
    let headingIndex = 0
    function render(n: DocumentNode, key: number): ReactNode {
        const children = n.content?.map(render)
        switch (n.type) {
            case 'doc':
                return <Fragment key={key}>{children}</Fragment>
            case 'text': {
                let result: ReactNode = n.text
                for (const m of n.marks || []) {
                    if (m.type === 'bold') result = <strong>{result}</strong>
                    if (m.type === 'italic') result = <em>{result}</em>
                    if (m.type === 'link' && safePostLink(m.attrs?.href || ''))
                        result = (
                            <a href={m.attrs!.href} rel="noopener noreferrer">
                                {result}
                            </a>
                        )
                }
                return <Fragment key={key}>{result}</Fragment>
            }
            case 'heading': {
                const id = 'section-' + ++headingIndex
                headings.push({ id, title: text(n) })
                return n.attrs?.level === 3 ? (
                    <h3 id={id} key={key}>
                        {children}
                    </h3>
                ) : (
                    <h2 id={id} key={key}>
                        {children}
                    </h2>
                )
            }
            case 'paragraph':
                return <p key={key}>{children}</p>
            case 'bulletList':
                return <ul key={key}>{children}</ul>
            case 'orderedList':
                return (
                    <ol start={Number(n.attrs?.start) || 1} key={key}>
                        {children}
                    </ol>
                )
            case 'listItem':
                return <li key={key}>{children}</li>
            case 'blockquote':
                return <blockquote key={key}>{children}</blockquote>
            case 'hardBreak':
                return <br key={key} />
            case 'horizontalRule':
                return <hr key={key} />
            case 'image':
                return (
                    <figure key={key}>
                        <img
                            src={String(n.attrs?.src)}
                            alt={String(n.attrs?.alt || '')}
                            loading="lazy"
                            decoding="async"
                            className="h-auto max-w-full rounded-lg"
                        />
                        {n.attrs?.caption ? (
                            <figcaption>{String(n.attrs.caption)}</figcaption>
                        ) : null}
                    </figure>
                )
            case 'table':
                return (
                    <div
                        key={key}
                        className="overflow-x-auto"
                        tabIndex={0}
                        role="region"
                        aria-label="Таблица"
                    >
                        <table>
                            <tbody>{children}</tbody>
                        </table>
                    </div>
                )
            case 'tableRow':
                return <tr key={key}>{children}</tr>
            case 'tableHeader':
                return (
                    <th
                        scope="col"
                        colSpan={Number(n.attrs?.colspan) || 1}
                        rowSpan={Number(n.attrs?.rowspan) || 1}
                        key={key}
                    >
                        {children}
                    </th>
                )
            case 'tableCell':
                return (
                    <td
                        colSpan={Number(n.attrs?.colspan) || 1}
                        rowSpan={Number(n.attrs?.rowspan) || 1}
                        key={key}
                    >
                        {children}
                    </td>
                )
            default:
                throw Error('Unsupported article node')
        }
    }
    const body = render(doc.content, 0)
    const url = 'https://asiamotors.su/blog/' + encodeURIComponent(slug)
    const structured = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: doc.title,
            description: doc.excerpt,
            image: doc.cover ? ['https://asiamotors.su' + doc.cover] : [],
            datePublished: publishedAt,
            dateModified: updatedAt || publishedAt,
            author: { '@type': 'Person', name: doc.author },
            publisher: { '@type': 'Organization', name: 'AsiaMotors' },
            mainEntityOfPage: url,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Главная',
                    item: 'https://asiamotors.su',
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Блог',
                    item: 'https://asiamotors.su/blog',
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: doc.title,
                    item: url,
                },
            ],
        },
    ]
    return (
        <article className="mx-auto max-w-4xl px-4 py-12 text-gray-800">
            {!preview && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structured).replace(
                            /</g,
                            '\\u003c',
                        ),
                    }}
                />
            )}
            <nav aria-label="Хлебные крошки" className="mb-8 text-sm">
                <Link href="/">Главная</Link> / <Link href="/blog">Блог</Link>
            </nav>
            <h1 className="break-words text-3xl font-bold sm:text-4xl">
                {doc.title}
            </h1>
            <p className="my-4 text-lg">{doc.excerpt}</p>
            <p className="mb-6 text-sm text-gray-500">
                {doc.author} ·{' '}
                <time dateTime={publishedAt}>
                    {new Intl.DateTimeFormat('ru-RU', {
                        timeZone: 'Asia/Vladivostok',
                    }).format(new Date(publishedAt))}
                </time>
            </p>
            {doc.cover && (
                <div className="mb-8">
                    <img
                        src={doc.cover}
                        alt={doc.coverAlt}
                        fetchPriority="high"
                        className="h-auto w-full rounded-xl"
                    />
                </div>
            )}
            {headings.length >= 3 && (
                <nav
                    aria-label="Содержание статьи"
                    className="mb-8 rounded-lg bg-gray-50 p-5"
                >
                    <p className="mb-2 font-semibold">Содержание</p>
                    <ol>
                        {headings.map((h) => (
                            <li key={h.id}>
                                <a href={'#' + h.id} className="text-red-700">
                                    {h.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            <div className="prose prose-lg max-w-none break-words prose-headings:scroll-mt-24 prose-img:max-w-full prose-table:w-full">
                {body}
            </div>
            {doc.showCta && !preview && <ArticleCta />}
        </article>
    )
}
