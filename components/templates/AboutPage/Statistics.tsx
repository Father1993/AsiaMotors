import AnimatedCounter from '@/components/ui/AnimatedCounter/AnimatedCounter'
import { COMPANY_CLIENTS, type CompanyExperience } from '@/shared/constants/company'
const Statistics = ({ experience }: { experience: CompanyExperience }) => {
    return (
        <section className="bg-red-50 rounded-3xl p-12 text-center mb-16">
            <h2 className="text-4xl font-bold mb-12 text-gray-800">
                Наши достижения
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { value: <AnimatedCounter value={COMPANY_CLIENTS} />, label: 'Довольных клиентов' },
                    { value: experience.years, label: experience.label },
                    { value: '100%', label: 'Гарантия на всех этапах' },
                    { value: '24/7', label: 'Поддержка' },
                ].map((stat, index) => (
                    <div key={index}>
                        <div className="text-5xl font-bold text-red-600 mb-4">
                            {stat.value}
                        </div>
                        <p className="text-gray-700">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Statistics
