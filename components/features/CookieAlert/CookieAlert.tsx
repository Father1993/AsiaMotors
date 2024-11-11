'use client'

import toast from 'react-hot-toast'
import { CookieAlertProps } from '@/shared/types/common'

const CookieAlert = ({ setCookieAlertOpen }: CookieAlertProps) => {
    const handleAcceptCookie = () => {
        document.cookie = 'CookieBy=AsiaMotors; max-age=' + 60 * 60 * 24 * 30

        if (document.cookie) {
            setCookieAlertOpen(false)
        } else {
            toast.error(
                'Файл cookie не может быть установлен! Пожалуйста, разблокируйте этот сайт с помощью настроек cookie вашего браузера.'
            )
        }
    }

    return (
        <div className="container cookie-popup__container">
            <button
                className="btn-reset cookie-popup__close"
                onClick={() => setCookieAlertOpen(false)}
            />
            <p className="cookie-popup__text">
                Мы используем файлы cookie для улучшения работы сайта, анализа
                трафика и персонализации контента. Продолжая использовать наш
                сайт, вы соглашаетесь с нашей{' '}
                <a
                    href="/privacy-policy"
                    className="underline hover:text-blue-600"
                >
                    политикой использования файлов cookie
                </a>
                . Вы можете изменить настройки cookie в любое время в настройках
                вашего браузера.
            </p>
            <button
                className="btn-reset cookie-popup__accept"
                onClick={handleAcceptCookie}
            >
                Принять
            </button>
        </div>
    )
}

export default CookieAlert
