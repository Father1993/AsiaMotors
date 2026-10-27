import type { Car, Country } from '@/shared/types/adminTypes'
export async function apiRequest<T>(
    url: string,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(url, { ...init, cache: 'no-store' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Ошибка запроса')
    return result as T
}
export function loadCatalog() {
    return apiRequest<{ cars: Car[]; countries: Country[] }>('/api/catalog')
}
