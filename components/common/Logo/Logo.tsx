import Link from 'next/link'
import Image from 'next/image'
import { LogoProps } from '@/shared/types/common'

const Logo = ({ className = '' }: LogoProps) => {
    return (
        <Link href="/" className={`flex items-center space-x-2 ${className}`}>
            <Image
                src="/img/asia-motors-logo.png"
                alt="Asia Motors логотип"
                width={120} // Укажите реальную ширину вашего логотипа
                height={30} // Укажите реальную высоту вашего логотипа
                priority // Приоритетная загрузка для логотипа
                className="h-auto w-auto" // Позволяет изображению быть отзывчивым
            />
        </Link>
    )
}

export default Logo
