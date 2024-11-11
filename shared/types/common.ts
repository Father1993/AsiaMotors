export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
}

export interface LogoProps {
    className?: string
}

export interface MobileMenuProps {
    isOpen?: boolean
    onClose?: () => void
}

export interface CookieAlertProps {
    setCookieAlertOpen: (value: boolean) => void
}
