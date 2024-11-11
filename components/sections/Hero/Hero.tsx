import { Button } from '@/components/common/Button'

const Hero: React.FC = () => {
    return (
        <section
            className="relative h-screen"
            role="banner"
            aria-label="Главный баннер"
        >
            <div className="container-wrapper h-full flex items-center">
                <div className="max-w-3xl">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                        Покупка автомобилей из Китая
                    </h1>
                    <p className="text-lg md:text-xl mb-6 md:mb-8">
                        Быстро, безопасно и выгодно. Прямые поставки без
                        посредников.
                    </p>
                    <Button variant="primary" size="lg">
                        Смотреть каталог
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Hero
