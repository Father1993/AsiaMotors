import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import type { LeadParams } from '../types/leads'
import { apiRequest } from '../lib/catalog-client'

export const useLeadForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const sending = useRef(false)
    const pending = useRef<{ body: string; key: string } | null>(null)
    const submitLead = async (onClose: () => void, params: LeadParams) => {
        if (sending.current) return
        const form = formRef.current
        const consent = form?.querySelector<HTMLInputElement>(
            'input[type="checkbox"]'
        )
        if (!consent?.checked) {
            toast.error('Подтвердите согласие на обработку персональных данных')
            return
        }
        sending.current = true
        setIsLoading(true)
        const body = JSON.stringify(params)
        if (pending.current?.body !== body)
            pending.current = { body, key: crypto.randomUUID() }
        try {
            await apiRequest('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...params,
                    request_key: pending.current!.key,
                    consent: true,
                    consent_version: '2026-10-27',
                    website:
                        form?.querySelector<HTMLInputElement>(
                            '[name="website"]'
                        )?.value || '',
                }),
            })
            toast.success('Заявка принята! Мы свяжемся с вами.')
            pending.current = null
            form?.reset()
            onClose()
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Не удалось отправить заявку'
            )
        } finally {
            sending.current = false
            setIsLoading(false)
        }
    }
    return { formRef, isLoading, submitLead }
}
