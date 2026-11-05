import Link from 'next/link'
import Image from 'next/image'
import { LogoProps } from '@/shared/types/common'
import { BRAND_LOGO } from '@/shared/constants/branding'

const Logo = ({ className = '', preload = false }: LogoProps) => {
    return (
        <Link href="/" aria-label="AsiaMotors — на главную" className={`flex items-center space-x-2 ${className}`}>
            <Image
                {...BRAND_LOGO}
                alt={BRAND_LOGO.alt}
                width={120}
                height={80}
                preload={preload}
                className="h-auto w-[120px] max-w-full object-contain"
            />
        </Link>
    )
}

export default Logo
