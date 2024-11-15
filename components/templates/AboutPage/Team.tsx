import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { teamMembersKhv } from '@/shared/constants/team'

const Team = () => {
    return (
        <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Наша команда
            </h2>
            <h3>Офис в Хабаровске</h3>
            <div className="grid md:grid-cols-3 gap-8 mb-10" id="team">
                {teamMembersKhv.map((member, index) => (
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
                    </motion.div>
                ))}
            </div>
            {/* <h3>Офис Владивосток</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {teamMembersKhv.map((member, index) => (
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
                    </motion.div>
                ))}
            </div>
            <h3>Офис в Китае</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {teamMembersKhv.map((member, index) => (
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
                    </motion.div>
                ))}
            </div> */}
        </section>
    )
}

export default Team
