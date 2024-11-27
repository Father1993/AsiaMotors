import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { teamOffices } from '@/shared/constants/team'

const Team = () => {
    const [currentOffice, setCurrentOffice] = useState(teamOffices[0])

    return (
        <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Команда
            </h2>
            {/* Современный переключатель офисов */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 p-2 bg-gray-50 rounded-2xl max-w-5xl mx-auto">
                {teamOffices.map((office) => (
                    <button
                        key={office.id}
                        onClick={() => setCurrentOffice(office)}
                        className={`
                                    relative px-6 py-3 rounded-xl transition-all duration-300
                                    font-medium text-sm
                                    ${
                                        currentOffice.id === office.id
                                            ? 'text-gray-900 bg-white shadow-lg shadow-gray-200/50 scale-105'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }
                                    before:absolute before:inset-0 before:rounded-xl before:transition-opacity
                                    before:opacity-0 hover:before:opacity-100
                                    before:bg-gradient-to-r before:from-purple-50 before:to-gray-50
                                    overflow-hidden
                                `}
                    >
                        <span className="relative z-10">{office.name}</span>
                        {currentOffice.id === office.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white rounded-xl"
                                transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 0.6,
                                }}
                            />
                        )}
                    </button>
                ))}
            </div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                Офис {currentOffice.name}
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mb-10" id="team">
                {currentOffice.members.map((member, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-2xl p-6 shadow-lg text-center"
                    >
                        <Image
                            src={member.image}
                            alt={member.name}
                            width={300}
                            height={300}
                            className="rounded-full mx-auto mb-4 w-48 h-48 object-cover"
                            quality={75}
                            loading="lazy"
                        />
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-gray-600 mb-3">{member.role}</p>
                        <p className="text-sm text-gray-500">
                            {member.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {member.telephone}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Team
