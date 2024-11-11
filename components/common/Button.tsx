import { ButtonProps } from '@/types/common'

export const Button = ({
    variant = 'primary',
    size = 'md',
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`
        rounded-lg font-medium
        ${variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}
        ${size === 'lg' ? 'px-8 py-4' : 'px-6 py-2'}
      `}
            {...props}
        >
            {children}
        </button>
    )
}
