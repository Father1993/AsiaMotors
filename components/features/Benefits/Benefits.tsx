import AnimatedCounter from '@/components/ui/AnimatedCounter/AnimatedCounter'
import { BENEFITS } from '@/shared/constants/benefits'

const Benefits = () => {
    return (
        <section
            className="py-20 bg-gradient-to-b from-white to-gray-50 "
            aria-label="Преимущества компании"
        >
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Почему выбирают AsiaMotors
                    </h2>
                    <p className="text-lg text-gray-600">
                        Более 270 довольных клиентов доверили нам покупку
                        автомобиля из Китая
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {BENEFITS.map((benefit) => (
                        <div
                            key={benefit.id}
                            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div
                                className={`w-16 h-16 bg-${benefit.color}-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <benefit.icon
                                    className={`w-8 h-8 text-${benefit.color}-600`}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
                        <div className="text-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0">
                            <div className="text-4xl font-bold text-red-600">
                                <AnimatedCounter
                                    startValue={270}
                                    maxValue={300}
                                    className="text-4xl font-bold"
                                />
                            </div>
                            <div className="text-sm text-gray-600">
                                Довольных клиентов
                            </div>
                        </div>
                        <div className="text-center border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0">
                            <div className="text-4xl font-bold text-red-600">
                                2+
                            </div>
                            <div className="text-sm text-gray-600">
                                Года на рынке
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600">
                                100%
                            </div>
                            <div className="text-sm text-gray-600">
                                Гарантия качества
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Benefits
