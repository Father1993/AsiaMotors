interface ImageSkeletonProps {
    size?: 'sm' | 'md' | 'lg'
    showIcon?: boolean
}

const ImageSkeleton = ({
    size = 'md',
    showIcon = true,
}: ImageSkeletonProps) => {
    const sizeClasses = {
        sm: 'h-32',
        md: 'h-48',
        lg: 'h-64',
    }

    return (
        <div
            className={`relative w-full ${sizeClasses[size]} overflow-hidden rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer`}
        >
            {/* Фоновая анимация */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wave" />

            {/* Иконка и текст */}
            {showIcon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-8-6a2 2 0 100-4 2 2 0 000 4z"
                        />
                    </svg>
                    <div className="text-sm text-gray-400">Загрузка...</div>
                </div>
            )}

            {/* Декоративные элементы */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
    )
}

export default ImageSkeleton
