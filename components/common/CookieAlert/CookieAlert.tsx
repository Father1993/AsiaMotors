import toast from 'react-hot-toast'

const CookieAlert = ({
    setCookieAlertOpen,
}: {
    setCookieAlertOpen: (arg0: boolean) => void
}) => {
    const handleAcceptCookie = () => {
        document.cookie =
            'CookieBy=Perevozka27.ru; max-age=' + 60 * 60 * 24 * 30

        if (document.cookie) {
            setCookieAlertOpen(false)
        } else {
            toast.error(
                // eslint-disable-next-line max-len
                'Файл cookie не может быть установлен! Пожалуйста, разблокируйте этот сайт с помощью настроек cookie ваше браузера...'
            )
        }
    }

    const handleCloseAlert = () => setCookieAlertOpen(false)

    return (
        <div className="container cookie-popup__container">
            <button
                className="btn-reset cookie-popup__close"
                onClick={handleCloseAlert}
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
