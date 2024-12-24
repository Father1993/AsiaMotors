'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Ошибка аутентификации
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {error === 'AccessDenied'
                            ? 'У вас нет доступа к этой странице'
                            : 'Произошла ошибка при входе в систему'}
                    </p>
                </div>
                <div className="mt-8 text-center">
                    <Link
                        href="/auth/signin"
                        className="text-blue-600 hover:text-blue-500"
                    >
                        Вернуться на страницу входа
                    </Link>
                </div>
            </div>
        </div>
    )
}
