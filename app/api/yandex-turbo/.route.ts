// import { NextResponse } from 'next/server'
// import { getCars, getPosts, formatPrice } from '@/shared/utils/catalog'

// export async function GET() {
//     try {
//         const baseUrl = 'https://asiamotors.su'

//         // Получаем данные
//         const [cars, posts] = await Promise.all([getCars(), getPosts()])

//         const rss = `<?xml version="1.0" encoding="UTF-8"?>
//         <rss xmlns:yandex="http://news.yandex.ru"
//              xmlns:media="http://search.yahoo.com/mrss/"
//              xmlns:turbo="http://turbo.yandex.ru"
//              version="2.0">
//             <channel>
//                 <title>AsiaMotors — Продажа новых и БУ автомобилей из Китая</title>
//                 <link>${baseUrl}</link>
//                 <description>AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая</description>
//                 <language>ru</language>
//                 <turbo:analytics type="Yandex" id="YOUR_METRIKA_ID"></turbo:analytics>

//                 <!-- Главная страница -->
//                 ${generateMainPage(baseUrl)}

//                 <!-- О нас -->
//                 ${generateAboutPage(baseUrl)}

//                 <!-- Контакты -->
//                 ${generateContactsPage(baseUrl)}

//                 <!-- Каталог автомобилей -->
//                 ${
//                     cars?.length
//                         ? cars
//                               .map((car) => generateCarPage(car, baseUrl))
//                               .join('')
//                         : ''
//                 }

//                 <!-- Блог -->
//                 ${
//                     posts?.length
//                         ? posts
//                               .map((post) => generatePostPage(post, baseUrl))
//                               .join('')
//                         : ''
//                 }
//             </channel>
//         </rss>`

//         return new NextResponse(rss, {
//             headers: {
//                 'Content-Type': 'application/xml',
//                 'Cache-Control': 'max-age=3600',
//             },
//         })
//     } catch (error) {
//         console.error('Error generating RSS:', error)
//         return new NextResponse('Error generating RSS', { status: 500 })
//     }
// }

// function generateMainPage(baseUrl: string) {
//     return `
//     <item turbo="true">
//         <link>${baseUrl}</link>
//         <pubDate>${new Date().toUTCString()}</pubDate>
//         <author>AsiaMotors</author>
//         <turbo:content>
//             <![CDATA[
//                 <header>
//                     <h1>AsiaMotors — Продажа новых и БУ автомобилей из Китая</h1>
//                     <figure>
//                         <img src="${baseUrl}/img/hero-image.jpg" />
//                     </figure>
//                 </header>
//                 <div class="main-content">
//                     <section class="hero">
//                         <h2>Надежные авто напрямую от поставщиков</h2>
//                         <p>AsiaMotors — ваш надежный выбор для покупки новых и подержанных автомобилей из Китая. Мы предлагаем широкий ассортимент авто по доступным ценам, от популярных моделей до премиум-класса.</p>
//                     </section>
//                     <section class="benefits">
//                         <h2>Наши преимущества</h2>
//                         <ul>
//                             <li>Прямые поставки из Китая</li>
//                             <li>Гарантия качества</li>
//                             <li>Полное сопровождение сделки</li>
//                             <li>Выгодные цены</li>
//                         </ul>
//                     </section>
//                     <section class="cta">
//                         <button formaction="${baseUrl}/catalog">Перейти в каталог</button>
//                     </section>
//                 </div>
//             ]]>
//         </turbo:content>
//     </item>
//     `
// }

// function generateAboutPage(baseUrl: string) {
//     return `
//     <item turbo="true">
//         <link>${baseUrl}/about</link>
//         <pubDate>${new Date().toUTCString()}</pubDate>
//         <author>AsiaMotors</author>
//         <turbo:content>
//             <![CDATA[
//                 <header>
//                     <h1>О компании AsiaMotors</h1>
//                     <figure>
//                         <img src="${baseUrl}/img/about-hero.jpg" />
//                     </figure>
//                 </header>
//                 <div class="about-content">
//                     <section class="hero-block">
//                         <h2>Профессиональный импорт автомобилей из Китая</h2>
//                         <p>Мы специализируемся на прямых поставках от производителей, имеем собственные офисы в Китае, обеспечиваем полное таможенное оформление и гарантийное обслуживание.</p>
//                     </section>
//                     <section class="advantages">
//                         <h2>Наши преимущества</h2>
//                         <ul>
//                             <li>Собственные офисы в Китае</li>
//                             <li>Прямые контракты с производителями</li>
//                             <li>Полный цикл сопровождения сделки</li>
//                             <li>Гарантия качества и безопасности</li>
//                         </ul>
//                     </section>
//                 </div>
//             ]]>
//         </turbo:content>
//     </item>
//     `
// }

// function generateContactsPage(baseUrl: string) {
//     return `
//     <item turbo="true">
//         <link>${baseUrl}/contacts</link>
//         <pubDate>${new Date().toUTCString()}</pubDate>
//         <author>AsiaMotors</author>
//         <turbo:content>
//             <![CDATA[
//                 <header>
//                     <h1>Контакты AsiaMotors</h1>
//                 </header>
//                 <div class="contacts-content">
//                     <section class="contact-info">
//                         <h2>Наши контакты</h2>
//                         <div class="contact-details">
//                             <p><strong>Телефон:</strong> <a href="tel:+7XXXXXXXXXX">+7 (XXX) XXX-XX-XX</a></p>
//                             <p><strong>Email:</strong> <a href="mailto:info@asiamotors.su">info@asiamotors.su</a></p>
//                             <p><strong>Адрес:</strong> г. Хабаровск, ул. Зеленая 3А, офис 215</p>
//                         </div>
//                     </section>
//                     <section class="working-hours">
//                         <h2>Время работы</h2>
//                         <p>Пн-Пт: 9:00 - 20:00</p>
//                         <p>Сб-Вс: 10:00 - 18:00</p>
//                     </section>
//                 </div>
//             ]]>
//         </turbo:content>
//     </item>
//     `
// }

// function generateCarPage(car: any, baseUrl: string) {
//     return `
//     <item turbo="true">
//         <link>${baseUrl}/catalog/${car.slug}</link>
//         <pubDate>${new Date(car.updatedAt).toUTCString()}</pubDate>
//         <author>AsiaMotors</author>
//         <turbo:content>
//             <![CDATA[
//                 <header>
//                     <h1>${car.brand} ${car.model} ${car.year}</h1>
//                     <figure>
//                         <img src="${car.mainImage}" />
//                     </figure>
//                 </header>
//                 <div class="car-content">
//                     <section class="car-info">
//                         <h2>Характеристики</h2>
//                         <div class="characteristics">
//                             <div class="char-item">
//                                 <span class="label">Год выпуска:</span>
//                                 <span class="value">${car.year}</span>
//                             </div>
//                             <div class="char-item">
//                                 <span class="label">Цена:</span>
//                                 <span class="value">${formatPrice(
//                                     car.price
//                                 )}</span>
//                             </div>
//                             <div class="char-item">
//                                 <span class="label">Двигатель:</span>
//                                 <span class="value">${car.engineVolume} л / ${
//         car.horsePower
//     } л.с.</span>
//                             </div>
//                             <div class="char-item">
//                                 <span class="label">Коробка:</span>
//                                 <span class="value">${car.transmission}</span>
//                             </div>
//                             <div class="char-item">
//                                 <span class="label">Привод:</span>
//                                 <span class="value">${car.drive}</span>
//                             </div>
//                             <div class="char-item">
//                                 <span class="label">Пробег:</span>
//                                 <span class="value">${car.mileage} км</span>
//                             </div>
//                             <div class="char-item">
//                                 <span class="label">Тип топлива:</span>
//                                 <span class="value">${car.fuelType}</span>
//                             </div>
//                         </div>
//                     </section>
//                     <section class="car-description">
//                         <h2>Описание</h2>
//                         ${car.description}
//                     </section>
//                     <section class="car-gallery">
//                         ${car.images
//                             ?.map(
//                                 (img) => `
//                             <figure>
//                                 <img src="${img.url}" />
//                                 ${
//                                     img.caption
//                                         ? `<figcaption>${img.caption}</figcaption>`
//                                         : ''
//                                 }
//                             </figure>
//                         `
//                             )
//                             .join('')}
//                     </section>
//                     <section class="car-actions">
//                         <button class="action-button" formaction="${baseUrl}/catalog/${
//         car.slug
//     }">
//                             Подробнее
//                         </button>
//                     </section>
//                 </div>
//             ]]>
//         </turbo:content>
//     </item>
//     `
// }

// function generatePostPage(post: any, baseUrl: string) {
//     return `
//     <item turbo="true">
//         <link>${baseUrl}/blog/${post.slug}</link>
//         <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
//         <author>AsiaMotors</author>
//         <turbo:content>
//             <![CDATA[
//                 <header>
//                     <h1>${post.title}</h1>
//                     <figure>
//                         <img src="${post.coverImage}" />
//                     </figure>
//                 </header>
//                 <div class="post-content">
//                     <article>
//                         ${post.content}
//                     </article>
//                     <div class="post-meta">
//                         <time datetime="${post.publishedAt}">${new Date(
//         post.publishedAt
//     ).toLocaleDateString('ru-RU')}</time>
//                         <span class="category">${post.category}</span>
//                     </div>
//                 </div>
//             ]]>
//         </turbo:content>
//     </item>
//     `
// }
