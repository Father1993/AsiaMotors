/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
}

export interface LogoProps {
    className?: string
}

export interface MobileMenuProps {
    onClose?: () => void
}

export interface CookieAlertProps {
    setCookieAlertOpen: (value: boolean) => void
}

export interface AnimatedCounterProps {
    startValue: number
    maxValue: number
    interval?: number
    className?: string
}

export interface Post {
    id?: string
    title: string
    excerpt: string
    content: string
    date: string
    author: string
    image: string
    slug: string
    readingTime?: string
    tags?: string[]
}

export interface PostsPageProps {
    post: Post
}

export interface Props {
    params: any
    searchParams?: any
}

export interface PricePopupProps {
    isOpen: boolean
    onClose: () => void
}

export interface ArrowLeftProps {
    className?: string
}

// Определяем правильные типы для параметров
export type PropsPost = {
    params: any
    searchParams?: any
}

// Обновляем тип для параметров страницы
export type PageParams = {
    params: any
    searchParams?: any
}

export interface PageProps {
    params: Promise<{
        slug: string
    }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export interface CarCardSkeletonProps {
    viewMode: 'grid' | 'list'
}

export interface ImageViewerProps {
    images: string[]
    currentIndex: number
    isOpen: boolean
    onClose: () => void
    onIndexChange: (index: number) => void
}
