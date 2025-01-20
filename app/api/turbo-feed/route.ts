import { getAllPosts } from '@/shared/utils/posts'

async function generateTurboContent() {
    const domain = 'asiamotors.su'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = `${protocol}://${domain}`

    // Получаем все посты блога
    const posts = await getAllPosts()

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:yandex="http://news.yandex.ru"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:turbo="http://turbo.yandex.ru"
     version="2.0">
    <channel>
        <title>Asia Motors - Автозапчасти для китайских автомобилей</title>
        <link>${baseUrl}</link>
        <description>Продажа автозапчастей для китайских автомобилей. Широкий ассортимент, гарантия качества.</description>
        <language>ru</language>
        
        <!-- Главная страница -->
        <item turbo="true">
            <turbo:extendedHtml>true</turbo:extendedHtml>
            <link>${baseUrl}</link>
            <pubDate>${new Date().toUTCString()}</pubDate>
            <author>Asia Motors</author>
            <turbo:content>
                <![CDATA[
                    <header>
                        <h1>Asia Motors - Автозапчасти для китайских автомобилей</h1>
                        <menu>
                            <a href="${baseUrl}/catalog">Каталог</a>
                            <a href="${baseUrl}/about">О нас</a>
                            <a href="${baseUrl}/contacts">Контакты</a>
                            <a href="${baseUrl}/blog">Блог</a>
                        </menu>
                    </header>
                    <p>Добро пожаловать в Asia Motors! Мы специализируемся на продаже качественных автозапчастей для китайских автомобилей.</p>
                ]]>
            </turbo:content>
        </item>

        <!-- Страница О нас -->
        <item turbo="true">
            <turbo:extendedHtml>true</turbo:extendedHtml>
            <link>${baseUrl}/about</link>
            <pubDate>${new Date().toUTCString()}</pubDate>
            <author>Asia Motors</author>
            <turbo:content>
                <![CDATA[
                    <header>
                        <h1>О компании Asia Motors</h1>
                        <menu>
                            <a href="${baseUrl}">Главная</a>
                            <a href="${baseUrl}/catalog">Каталог</a>
                            <a href="${baseUrl}/contacts">Контакты</a>
                        </menu>
                    </header>
                    <p>Asia Motors - ваш надежный партнер в мире автозапчастей для китайских автомобилей.</p>
                ]]>
            </turbo:content>
        </item>

        <!-- Страница контактов -->
        <item turbo="true">
            <turbo:extendedHtml>true</turbo:extendedHtml>
            <link>${baseUrl}/contacts</link>
            <pubDate>${new Date().toUTCString()}</pubDate>
            <author>Asia Motors</author>
            <turbo:content>
                <![CDATA[
                    <header>
                        <h1>Контакты Asia Motors</h1>
                        <menu>
                            <a href="${baseUrl}">Главная</a>
                            <a href="${baseUrl}/about">О нас</a>
                            <a href="${baseUrl}/catalog">Каталог</a>
                        </menu>
                    </header>
                    <p>Свяжитесь с нами для получения консультации и заказа автозапчастей.</p>
                ]]>
            </turbo:content>
        </item>

        <!-- Блог -->
        ${posts
            .map(
                (post) => `
        <item turbo="true">
            <turbo:extendedHtml>true</turbo:extendedHtml>
            <link>${baseUrl}/blog/${post.slug}</link>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <author>${post.author}</author>
            <metrics>
                <yandex schema_identifier="blog_post">
                    <breadcrumblist>
                        <breadcrumb url="${baseUrl}" text="Главная"/>
                        <breadcrumb url="${baseUrl}/blog" text="Блог"/>
                        <breadcrumb url="${baseUrl}/blog/${post.slug}" text="${
                    post.title
                }"/>
                    </breadcrumblist>
                </yandex>
            </metrics>
            <turbo:content>
                <![CDATA[
                    <header>
                        <h1>${post.title}</h1>
                        <figure>
                            <img src="${post.image}" />
                        </figure>
                        <menu>
                            <a href="${baseUrl}">Главная</a>
                            <a href="${baseUrl}/blog">Блог</a>
                        </menu>
                    </header>
                    <article>
                        ${post.content}
                    </article>
                    ${
                        post.tags && post.tags.length > 0
                            ? `
                    <div class="tags">
                        ${post.tags
                            .map((tag) => `<span class="tag">${tag}</span>`)
                            .join('')}
                    </div>
                    `
                            : ''
                    }
                    <div class="meta">
                        <time datetime="${post.date}">${new Date(
                    post.date
                ).toLocaleDateString('ru-RU')}</time>
                        ${
                            post.readingTime
                                ? `<span class="reading-time">${post.readingTime}</span>`
                                : ''
                        }
                    </div>
                ]]>
            </turbo:content>
        </item>
        `
            )
            .join('\n')}
    </channel>
</rss>`
}

export async function GET() {
    const feed = await generateTurboContent()

    return new Response(feed, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'max-age=3600',
        },
    })
}
