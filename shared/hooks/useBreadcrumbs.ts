import { usePathname } from 'next/navigation'
import * as breadcrumbConstants from '@/shared/constants/breadcrumbs'
import { BreadcrumbItem } from '../types/breadcrumbs'

export const useBreadcrumbs = (pageTitle?: string): BreadcrumbItem[] => {
    const pathname = usePathname()

    // Защита от undefined pathname
    if (!pathname) {
        return []
    }

    try {
        // Обработка динамических путей блога
        if (pathname.startsWith('/blog/')) {
            // Проверяем наличие pageTitle для динамических страниц
            if (!pageTitle) {
                console.warn('pageTitle is required for dynamic blog pages')
                return breadcrumbConstants.BLOG_BREADCRUMBS
            }

            return [
                ...breadcrumbConstants.BLOG_BREADCRUMBS,
                {
                    label: pageTitle,
                    href: pathname,
                },
            ]
        }

        // Базовые хлебные крошки для известных путей
        switch (pathname) {
            case '/blog':
                return breadcrumbConstants.BLOG_BREADCRUMBS
            case '/about':
                return breadcrumbConstants.ABOUT_BREADCRUMBS
            case '/how-to-buy':
                return breadcrumbConstants.HOW_TO_BUY_BREADCRUMBS

            default:
                // Если путь неизвестен, возвращаем пустой массив
                console.debug(`No breadcrumbs found for path: ${pathname}`)
                return []
        }
    } catch (error) {
        // Обработка возможных ошибок
        console.error('Error in useBreadcrumbs:', error)
        return []
    }
}
