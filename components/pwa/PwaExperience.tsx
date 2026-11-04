'use client'
import { useEffect, useRef, useState } from 'react'
import './pwa.css'
type InstallEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
type NavigatorStandalone = Navigator & { standalone?: boolean }

function hasFilledForm() {
    const admin =
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin/')
    return Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]),textarea',
        ),
    ).some(
        (field) =>
            field.value !== field.defaultValue ||
            (!admin && field.value.trim() !== ''),
    )
}
export default function PwaExperience({
    kind = 'client',
    dirty = false,
}: {
    kind?: 'client' | 'manager'
    dirty?: boolean
}) {
    const [install, setInstall] = useState<InstallEvent | null>(null)
    const [manual, setManual] = useState<'ios' | 'mac' | 'android' | null>(null)
    const [standalone, setStandalone] = useState(false)
    const [dismissed, setDismissed] = useState(true)
    const [waiting, setWaiting] = useState<ServiceWorkerRegistration | null>(
        null,
    )
    const [reloadReady, setReloadReady] = useState(false)
    const [offline, setOffline] = useState(false)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const reloadRequested = useRef(false)
    const dirtyRef = useRef(dirty)
    useEffect(() => {
        dirtyRef.current = dirty
    }, [dirty])
    const key = 'asiamotors:pwa-dismiss:' + kind
    useEffect(() => {
        const display = window.matchMedia('(display-mode: standalone)')
        const check = () =>
            setStandalone(
                display.matches ||
                    (navigator as NavigatorStandalone).standalone === true,
            )
        check()
        display.addEventListener('change', check)
        function readEnvironment() {
            const ios =
                /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' &&
                    navigator.maxTouchPoints > 1)
            const safari = /Version\/(\d+).*Safari\//.exec(navigator.userAgent)
            setManual(
                ios
                    ? 'ios'
                    : /Android/i.test(navigator.userAgent)
                      ? 'android'
                      : /Mac/.test(navigator.platform) &&
                          safari &&
                          Number(safari[1]) >= 17
                        ? 'mac'
                        : null,
            )
            try {
                setDismissed(
                    Date.now() - Number(localStorage.getItem(key) || 0) <
                        7 * 24 * 60 * 60 * 1000,
                )
            } catch {
                setDismissed(false)
            }
        }
        readEnvironment()
        const before = (e: Event) => {
            e.preventDefault()
            setInstall(e as InstallEvent)
        }
        const installed = () => {
            setInstall(null)
            setStandalone(true)
        }
        const connection = () => setOffline(!navigator.onLine)
        connection()
        window.addEventListener('online', connection)
        window.addEventListener('offline', connection)
        window.addEventListener('beforeinstallprompt', before)
        window.addEventListener('appinstalled', installed)
        let registration: ServiceWorkerRegistration | undefined
        let disposed = false
        const update = () => {
            if (registration?.waiting) setWaiting(registration)
        }
        const found = () => {
            const worker = registration?.installing
            worker?.addEventListener('statechange', () => {
                if (
                    worker.state === 'installed' &&
                    navigator.serviceWorker.controller
                )
                    update()
            })
        }
        let hadController =
            'serviceWorker' in navigator && !!navigator.serviceWorker.controller
        const changed = () => {
            if (!reloadRequested.current) {
                setWaiting(null)
                if (hadController) setReloadReady(true)
                hadController = true
                return
            }
            if (!dirtyRef.current && !hasFilledForm()) window.location.reload()
            else {
                setReloadReady(true)
                setBusy(false)
                setWaiting(null)
                setMessage(
                    'Новая версия готова. Сохраните изменения перед перезагрузкой.',
                )
            }
        }
        const focus = () => {
            if (navigator.onLine) void registration?.update().catch(() => {})
        }
        if ('serviceWorker' in navigator && window.isSecureContext) {
            navigator.serviceWorker.addEventListener(
                'controllerchange',
                changed,
            )
            void navigator.serviceWorker
                .register('/sw.js', { scope: '/', updateViaCache: 'none' })
                .then((reg) => {
                    if (disposed) return
                    registration = reg
                    update()
                    reg.addEventListener('updatefound', found)
                    window.addEventListener('focus', focus)
                })
                .catch(() => {})
        }
        return () => {
            disposed = true
            display.removeEventListener('change', check)
            window.removeEventListener('beforeinstallprompt', before)
            window.removeEventListener('appinstalled', installed)
            window.removeEventListener('online', connection)
            window.removeEventListener('offline', connection)
            window.removeEventListener('focus', focus)
            registration?.removeEventListener('updatefound', found)
            if ('serviceWorker' in navigator)
                navigator.serviceWorker.removeEventListener(
                    'controllerchange',
                    changed,
                )
        }
    }, [key])
    async function prompt() {
        if (!install || busy) return
        setBusy(true)
        try {
            await install.prompt()
            const choice = await install.userChoice
            setInstall(null)
            if (choice.outcome === 'accepted') setStandalone(true)
        } catch {
            setMessage(
                'Установка не завершена. Попробуйте через меню браузера.',
            )
            setInstall(null)
        } finally {
            setBusy(false)
        }
    }
    function dismiss() {
        setDismissed(true)
        try {
            localStorage.setItem(key, String(Date.now()))
        } catch {}
    }
    const showInstall = !standalone && !dismissed && (install || manual)
    if (!showInstall && !waiting && !reloadReady && !offline && !message)
        return null
    return (
        <aside
            className={
                'pwa-panel ' +
                (kind === 'manager' ? 'pwa-panel-manager' : 'pwa-panel-client')
            }
            aria-label="Приложение AsiaMotors"
        >
            {offline && (
                <p role="status">
                    Нет подключения. Для сохранения изменений и отправки заявки
                    нужен интернет. Не закрывайте заполненную форму.
                </p>
            )}
            {(waiting || reloadReady) && (
                <div>
                    <p>Доступна новая версия приложения.</p>
                    {dirty && (
                        <p>
                            Сначала сохраните изменения. Обновление перезагрузит
                            страницу.
                        </p>
                    )}
                    <button
                        type="button"
                        disabled={dirty || busy}
                        onClick={() => {
                            if (dirty || (!reloadReady && !waiting?.waiting))
                                return
                            if (hasFilledForm()) {
                                setMessage(
                                    'Перед обновлением завершите или очистите заполненную форму.',
                                )
                                return
                            }
                            if (reloadReady) {
                                window.location.reload()
                                return
                            }
                            reloadRequested.current = true
                            setBusy(true)
                            waiting?.waiting?.postMessage({
                                type: 'ACTIVATE_UPDATE',
                            })
                        }}
                    >
                        Обновить приложение
                    </button>
                </div>
            )}
            {showInstall && (
                <div>
                    <strong>
                        {kind === 'manager'
                            ? 'AsiaMotors — управление'
                            : 'AsiaMotors — автомобили'}
                    </strong>
                    <p>
                        Добавьте приложение для быстрого открытия{' '}
                        {kind === 'manager'
                            ? 'каталога, статей и заявок'
                            : 'каталога и статей'}
                        .
                    </p>
                    {install ? (
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => void prompt()}
                        >
                            Установить приложение
                        </button>
                    ) : (
                        <p>
                            {manual === 'ios'
                                ? 'Нажмите «Поделиться» → «На экран Домой» (или «Добавить на экран Домой»). Если доступно, включите «Открывать как веб-приложение».'
                                : manual === 'android'
                                  ? 'Откройте меню браузера → «Установить приложение» или «Добавить на главный экран». Название пункта зависит от браузера; иногда доступен только ярлык сайта.'
                                  : 'В Safari откройте «Файл» → «Добавить в Dock».'}
                        </p>
                    )}
                    <button
                        type="button"
                        className="pwa-later"
                        onClick={dismiss}
                    >
                        Позже
                    </button>
                </div>
            )}
            {message && <p role="status">{message}</p>}
        </aside>
    )
}
