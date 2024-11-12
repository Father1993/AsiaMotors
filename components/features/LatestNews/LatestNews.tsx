import Link from 'next/link'

const LatestNews = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold">Новости и обзоры</h2>
                    <Link
                        href="/blog"
                        className="text-red-600 hover:text-red-700"
                    >
                        Все статьи →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Карточки новостей */}
                </div>
            </div>
        </section>
    )
}

export default LatestNews
