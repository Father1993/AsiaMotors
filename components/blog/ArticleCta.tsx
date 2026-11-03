'use client'
import Link from 'next/link'
import { useModalStore } from '@/components/provider/ModalProvider'
export default function ArticleCta() {
    const open = useModalStore((s) => s.openPopup)
    return (
        <aside className="mt-10 rounded-xl bg-gray-50 p-6">
            <h2 className="text-xl font-bold">Подберём автомобиль из Китая</h2>
            <p className="my-3">
                Уточните стоимость и условия поставки у команды AsiaMotors.
            </p>
            <div className="flex flex-wrap gap-4">
                <button
                    type="button"
                    onClick={open}
                    className="rounded-lg bg-red-600 px-5 py-3 text-white"
                >
                    Рассчитать стоимость
                </button>
                <Link href="/catalog" className="rounded-lg border px-5 py-3">
                    Посмотреть каталог
                </Link>
            </div>
        </aside>
    )
}
