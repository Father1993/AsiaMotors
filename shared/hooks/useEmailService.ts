import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'react-hot-toast'
import { EmailConfig } from '../types/emailService'

export const useEmailService = (config: EmailConfig) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [isLoading, setIsLoading] = useState(false)

    const sendEmail = async (onSuccess?: () => void) => {
        setIsLoading(true)
        try {
            await emailjs.sendForm(
                config.serviceId,
                config.templateId,
                formRef.current!,
                config.publicKey
            )
            toast.success('Сообщение успешно отправлено!')
            onSuccess?.()
        } catch (error) {
            toast.error('Произошла ошибка при отправке')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { formRef, isLoading, sendEmail }
}
