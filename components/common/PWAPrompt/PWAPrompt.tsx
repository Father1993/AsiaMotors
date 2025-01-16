/* eslint-disable @next/next/no-img-element */
'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Расширяем интерфейс Navigator для iOS
interface NavigatorWithStandalone extends Navigator {
    standalone?: boolean
}

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const PWAPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        const isMobile = () => {
            const userAgent = window.navigator.userAgent.toLowerCase()
            return /iphone|ipad|ipod|android|mobile|phone/i.test(userAgent)
        }

        if (typeof window === 'undefined' || !isMobile()) return

        const isIOS = /iphone|ipad|ipod/i.test(
            window.navigator.userAgent.toLowerCase()
        )

        const checkIfInstalled = () => {
            try {
                if (isIOS) {
                    // Правильное приведение типов для iOS
                    const nav = window.navigator as NavigatorWithStandalone
                    return nav.standalone === true
                }

                return (
                    window.matchMedia('(display-mode: standalone)').matches ||
                    document.referrer.includes('android-app://')
                )
            } catch (error) {
                console.error('Error checking PWA status:', error)
                return false
            }
        }

        const shouldShowPrompt = () => {
            try {
                const lastPromptTime = localStorage.getItem('pwaPromptTime')
                const dismissCount = parseInt(
                    localStorage.getItem('pwaDismissCount') || '0'
                )
                const now = new Date().getTime()

                return (
                    !checkIfInstalled() &&
                    (!lastPromptTime ||
                        now - parseInt(lastPromptTime) > 5 * 60 * 1000) &&
                    dismissCount < 3
                )
            } catch (error) {
                console.error('Error checking prompt conditions:', error)
                return false
            }
        }

        // Обработчик события beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            try {
                e.preventDefault()
                setDeferredPrompt(e as BeforeInstallPromptEvent)

                if (shouldShowPrompt()) {
                    setShowPrompt(true)
                    localStorage.setItem(
                        'pwaPromptTime',
                        new Date().getTime().toString()
                    )
                }
            } catch (error) {
                console.error('Error handling install prompt:', error)
            }
        }

        let mediaQuery: MediaQueryList | null = null
        try {
            // Слушаем изменение режима отображения
            mediaQuery = window.matchMedia('(display-mode: standalone)')
            const displayModeHandler = () => {
                checkIfInstalled()
            }

            mediaQuery.addListener(displayModeHandler)

            if (!checkIfInstalled()) {
                window.addEventListener(
                    'beforeinstallprompt',
                    handleBeforeInstallPrompt
                )
            }

            // Проверяем каждые 5 минут
            const interval = setInterval(() => {
                if (shouldShowPrompt()) {
                    setShowPrompt(true)
                    localStorage.setItem(
                        'pwaPromptTime',
                        new Date().getTime().toString()
                    )
                }
            }, 5 * 60 * 1000)

            return () => {
                window.removeEventListener(
                    'beforeinstallprompt',
                    handleBeforeInstallPrompt
                )
                if (mediaQuery) {
                    mediaQuery.removeListener(displayModeHandler)
                }
                clearInterval(interval)
            }
        } catch (error) {
            console.error('Error setting up PWA listeners:', error)
            return () => {}
        }
    }, [])

    const handleInstall = async () => {
        if (deferredPrompt) {
            try {
                await deferredPrompt.prompt()
                const result = await deferredPrompt.userChoice

                if (result.outcome === 'accepted') {
                    setShowPrompt(false)
                    setIsInstalled(true)
                    localStorage.removeItem('pwaDismissCount') // Сбрасываем счетчик отказов
                } else {
                    // Увеличиваем счетчик отказов
                    const dismissCount = parseInt(
                        localStorage.getItem('pwaDismissCount') || '0'
                    )
                    localStorage.setItem(
                        'pwaDismissCount',
                        (dismissCount + 1).toString()
                    )
                }
            } catch (error) {
                console.error('Error installing PWA:', error)
            }
            setDeferredPrompt(null)
        }
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        // Увеличиваем счетчик отказов
        const dismissCount = parseInt(
            localStorage.getItem('pwaDismissCount') || '0'
        )
        localStorage.setItem('pwaDismissCount', (dismissCount + 1).toString())

        // Устанавливаем более длительную задержку после отказа
        const now = new Date().getTime()
        localStorage.setItem('pwaPromptTime', (now + 30 * 60 * 1000).toString()) // +30 минут
    }

    // Не показываем ничего, если приложение уже установлено
    if (isInstalled) return null

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                    <img
                                        src="/img/favicon-32x32.png"
                                        alt="Asia Motors"
                                        className="w-6 h-6"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Установите приложение
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Быстрый доступ к Asia Motors
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Закрыть</span>
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleInstall}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors"
                            >
                                Установить
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="flex-1 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                Позже
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PWAPrompt