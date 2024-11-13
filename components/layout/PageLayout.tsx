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
            <Toaster position="top-right" />
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
