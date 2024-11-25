import { EmailConfig } from '../types/emailService'

if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
    throw new Error('NEXT_PUBLIC_EMAILJS_SERVICE_ID is not defined')
}

if (!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
    throw new Error('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID is not defined')
}

if (!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
    throw new Error('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY is not defined')
}
if (!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_2) {
    throw new Error('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_2 is not defined')
}

export const emailConfig: EmailConfig = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
}

// Добавляем новый конфиг для формы запчастей
export const sparesEmailConfig: EmailConfig = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_2,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
}
