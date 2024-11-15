import { motion } from 'framer-motion'
import { advantagesList } from '@/shared/constants/team'

const AdvantagesBlock = () => {
    return (
        <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Почему выбирают нас
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
                {advantagesList.map((advantage, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-center mb-4">
                            {advantage.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">
                            {advantage.title}
                        </h3>
                        <p className="text-gray-600">{advantage.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default AdvantagesBlock
