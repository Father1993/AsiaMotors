'use client'
import { useEffect, useState } from 'react'
import Next13ProgressBar from 'next13-progressbar'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './Layout'
import CookieAlert from '../features/CookieAlert/CookieAlert'

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
    const [cookieAlertOpen, setCookieAlertOpen] = useState(false)

    useEffect(() => {
        const hasCookie = document.cookie.includes('CookieBy=AsiaMotors')
        if (!hasCookie) {
            const timer = setTimeout(() => {
                setCookieAlertOpen(true)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [])

    return (
        <>
            <Toaster
                position="bottom-center"
                toastOptions={{
                    // Увеличенная длительность для лучшей читаемости
                    duration: 4000,

                    // Базовые стили для всех тостов
                    style: {
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff',
                    },

                    // Стили для успешных уведомлений
                    success: {
                        style: {
                            background: '#10B981',
                        },
                    },

                    // Стили для ошибок
                    error: {
                        style: {
                            background: '#EF4444',
                        },
                    },
                }}
            />
            <Next13ProgressBar height="4px" color="#9466FF" showOnShallow />
            <Layout>
                <main>{children}</main>
            </Layout>
            <AnimatePresence>
                {cookieAlertOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="cookie-popup"
                    >
                        <CookieAlert setCookieAlertOpen={setCookieAlertOpen} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default PagesLayout
