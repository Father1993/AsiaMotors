import type { Car, Country } from '@/shared/types/adminTypes'
export class ApiError extends Error {
    constructor(message: string, public status: number, public fieldErrors: Record<string, string[]> = {}) {
        super(message)
    }
}
export async function apiRequest<T>(
    url: string,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...init, cache: 'no-store' })
    const result = await response.json().catch(() => ({ error: 'Сервис временно недоступен. Повторите позже.' }))
    if (!response.ok) throw new ApiError(result.error || 'Ошибка запроса', response.status, result.fieldErrors)
    return result as T
}
export function loadCatalog() {
    return apiRequest<{ cars: Car[]; countries: Country[] }>('/api/catalog')
}
