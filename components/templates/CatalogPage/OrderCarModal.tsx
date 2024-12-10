import { Fragment } from 'react'
import toast from 'react-hot-toast'
import { Dialog, Transition } from '@headlessui/react'
import { useEmailService } from '@/shared/hooks/useEmailService'
import { emailConfig } from '@/shared/config/emailService'
import { OrderCarModalProps } from '@/shared/types/orderCarModal'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { PatternFormat } from 'react-number-format'

export const OrderCarModal = ({ isOpen, onClose, car }: OrderCarModalProps) => {
    const { formRef, isLoading, sendEmail } = useEmailService(emailConfig)

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
        return phoneRegex.test(phone)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const phone = formData.get('phone') as string

        if (!validatePhone(phone)) {
            toast.error('Пожалуйста, введите корректный номер телефона')
            return
        }

        await sendEmail(onClose, {
            form_name: 'Форма заказа автомобиля',
            user_name: formData.get('name') as string,
            user_phone: formData.get('phone') as string,
            message: formData.get('message') as string,
            car_model: car.brand + ' ' + car.model,
        })
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                    <span className="sr-only">Закрыть</span>
                                </button>

                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-bold text-gray-900 mb-6"
                                >
                                    Заказать{' '}
                                    {car.brand +
                                        ' ' +
                                        car.model +
                                        ' ' +
                                        car.year +
                                        ' года'}
                                </Dialog.Title>

                                <form
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Ваше имя
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Иванов Иван"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Телефон
                                        </label>
                                        <PatternFormat
                                            format="+7 (###) ###-##-##"
                                            mask="_"
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="+7 (999) 999-99-99"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Сообщение...
                                        </label>
                                        <textarea
                                            name="message"
                                            id="message"
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Ваше сообщение..."
                                        />
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-3 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading
                                                ? 'Отправка...'
                                                : 'Отправить'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Нажимая кнопку, вы соглашаетесь с{' '}
                                        <a
                                            href="/privacy"
                                            className="text-red-500 hover:underline"
                                        >
                                            политикой конфиденциальности
                                        </a>
                                    </p>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
