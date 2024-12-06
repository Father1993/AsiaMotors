'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import RutubeIcon from '@/components/ui/RutubeIcon'
import {
    FaYoutube,
    FaTiktok,
    FaInstagram,
    FaTelegramPlane,
    FaVk,
} from 'react-icons/fa'
// import DzenIcon from '@/components/ui/DzenIcon'

const socialLinks = [
    {
        name: 'Telegram',
        icon: <FaTelegramPlane />,
        color: 'text-blue-500 hover:text-blue-600',
        link: 'https://t.me/asiamotors',
    },
    {
        name: 'YouTube',
        icon: <FaYoutube />,
        color: 'text-red-600 hover:text-red-700',
        link: 'https://www.youtube.com/@AsiaMotors_su',
    },
    {
        name: 'TikTok',
        icon: <FaTiktok />,
        color: 'text-black hover:text-gray-800',
        link: 'https://www.tiktok.com/@asiamotors.su',
    },
    {
        name: 'Instagram',

        icon: <FaInstagram />,
        color: 'text-pink-600 hover:text-pink-700',
        link: 'https://www.instagram.com/asiamotors_su/#',
    },
    {
        name: 'VK',
        icon: <FaVk />,
        color: 'text-blue-800 hover:text-blue-900',
        link: 'https://vk.com/asiamotors_su',
    },
    {
        name: 'RuTube',
        icon: <RutubeIcon />,
        color: 'text-red-800 hover:text-red-900',
        link: 'https://rutube.ru/channel/49744487/',
    },
    // {
    //     name: 'Дзен',
    //     icon: <DzenIcon />,
    //     color: 'text-yellow-600 hover:text-yellow-700',
    //     link: 'https://dzen.ru/asiamotors',
    // },
]

const Social = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-lg p-10 text-center"
                >
                    <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
                        Следите за нами в социальных сетях
                    </h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                        Будьте в курсе последних новостей, эксклюзивных
                        предложений и захватывающих историй о мире автомобилей
                        из Китая
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        {socialLinks.map((social, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={social.link}
                                    target="_blank"
                                    className={`
                                        w-16 h-16 rounded-full 
                                        flex items-center justify-center 
                                        ${social.color} 
                                        bg-gray-100 hover:bg-gray-200 
                                        transition-all duration-300 
                                        shadow-md hover:shadow-lg
                                    `}
                                >
                                    {React.cloneElement(social.icon, {
                                        className: 'w-8 h-8',
                                    })}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Social
