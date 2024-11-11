'use client'
import { useEffect, useState } from 'react'
import Next13ProgressBar from 'next13-progressbar'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Layout from './Layout'
import CookieAlert from '../common/CookieAlert/CookieAlert'

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
    const [cookieAlertOpen, setCookieAlertOpen] = useState(false)

    useEffect(() => {
        const checkCookie = document.cookie.indexOf('CookieBy=AsiaMotors')
        if (checkCookie !== -1) {
            setCookieAlertOpen(false)
        } else {
            const timer = setTimeout(() => setCookieAlertOpen(true), 3000)
            return () => clearTimeout(timer)
        }
    }, [])

    return (
        <>
            <Toaster position="top-right" />
            <Next13ProgressBar height="4px" color="#9466FF" showOnShallow />
            <Layout>
                <main className="pt-40">{children}</main>
            </Layout>
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
        </>
    )
}

export default PagesLayout
