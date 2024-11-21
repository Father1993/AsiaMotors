import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'react-hot-toast'
import { EmailConfig, EmailTemplateParams } from '../types/emailService'

export const useEmailService = (config: EmailConfig) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [isLoading, setIsLoading] = useState(false)

    const sendEmail = async (
        onClose: () => void,
        templateParams: EmailTemplateParams
    ) => {
        setIsLoading(true)
        try {
            await emailjs.send(
                config.serviceId,
                config.templateId,
                templateParams,
                config.publicKey
            )
            toast.success('Сообщение успешно отправлено!')
            if (formRef.current) formRef.current.reset()
            onClose()
        } catch (error) {
            console.error('Ошибка отправки:', error)
            toast.error('Ошибка при отправке сообщения')
        } finally {
            setIsLoading(false)
        }
    }

    return { formRef, isLoading, sendEmail }
}
