import { NextResponse } from 'next/server'
import { getCars } from '@/shared/utils/catalog' // Предполагаем, что у вас есть такая функция
import { getPosts } from '@/shared/utils/blog' // Предполагаем, что у вас есть такая функция

export async function GET() {
    const baseUrl = 'https://asiamotors.su'

    // Получаем данные
    const cars = await getCars()
    const posts = await getPosts()

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:yandex="http://news.yandex.ru"
         xmlns:media="http://search.yahoo.com/mrss/"
         xmlns:turbo="http://turbo.yandex.ru"
         version="2.0">
        <channel>
            <title>AsiaMotors — Продажа новых и БУ автомобилей из Китая</title>
            <link>${baseUrl}</link>
            <description>AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая</description>
            <language>ru</language>
            <turbo:analytics type="Yandex" id="YOUR_METRIKA_ID"></turbo:analytics>
            
            <!-- Главная страница -->
            <item turbo="true">
                <link>${baseUrl}</link>
                <pubDate>${new Date().toUTCString()}</pubDate>
                <author>AsiaMotors</author>
                <turbo:content>
                    <![CDATA[
                        <header>
                            <h1>AsiaMotors — Продажа новых и БУ автомобилей из Китая</h1>
                            <figure>
                                <img src="${baseUrl}/img/hero-image.jpg" />
                            </figure>
                        </header>
                        <div class="main-content">
                            <section>
                                <h2>Надежные авто напрямую от поставщиков</h2>
                                <p>AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса.</p>
                            </section>
                        </div>
                    ]]>
                </turbo:content>
            </item>

            <!-- Каталог автомобилей -->
            ${cars
                .map(
                    (car) => `
                <item turbo="true">
                    <link>${baseUrl}/catalog/${car.slug}</link>
                    <pubDate>${new Date(car.updatedAt).toUTCString()}</pubDate>
                    <author>AsiaMotors</author>
                    <turbo:content>
                        <![CDATA[
                            <header>
                                <h1>${car.brand} ${car.model}</h1>
                                <figure>
                                    <img src="${car.mainImage}" />
                                </figure>
                            </header>
                            <div class="car-content">
                                <section class="car-info">
                                    <h2>Характеристики</h2>
                                    <div class="characteristics">
                                        <div class="char-item">
                                            <span class="label">Год выпуска:</span>
                                            <span class="value">${
                                                car.year
                                            }</span>
                                        </div>
                                        <div class="char-item">
                                            <span class="label">Цена:</span>
                                            <span class="value">${
                                                car.price
                                            } ₽</span>
                                        </div>
                                        <!-- Другие характеристики -->
                                    </div>
                                </section>
                                <section class="car-description">
                                    <h2>Описание</h2>
                                    ${car.description}
                                </section>
                                <section class="car-gallery">
                                    ${car.images
                                        .map(
                                            (img) => `
                                        <figure>
                                            <img src="${img.url}" />
                                            <figcaption>${
                                                img.caption || ''
                                            }</figcaption>
                                        </figure>
                                    `
                                        )
                                        .join('')}
                                </section>
                            </div>
                        ]]>
                    </turbo:content>
                </item>
            `
                )
                .join('')}

            <!-- Блог -->
            ${posts
                .map(
                    (post) => `
                <item turbo="true">
                    <link>${baseUrl}/blog/${post.slug}</link>
                    <pubDate>${new Date(
                        post.publishedAt
                    ).toUTCString()}</pubDate>
                    <author>${post.author}</author>
                    <turbo:content>
                        <![CDATA[
                            <header>
                                <h1>${post.title}</h1>
                                <figure>
                                    <img src="${post.coverImage}" />
                                </figure>
                            </header>
                            <div class="post-content">
                                <article>
                                    ${post.content}
                                </article>
                                <div class="post-meta">
                                    <time datetime="${
                                        post.publishedAt
                                    }">${new Date(
                        post.publishedAt
                    ).toLocaleDateString('ru-RU')}</time>
                                    <span class="category">${
                                        post.category
                                    }</span>
                                </div>
                            </div>
                        ]]>
                    </turbo:content>
                </item>
            `
                )
                .join('')}
        </channel>
    </rss>`

    return new NextResponse(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600',
        },
    })
}
