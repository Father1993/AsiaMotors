const CustomSkeleton = () => {
    return (
        <div className="absolute inset-0 z-10">
            <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <svg
                            className="w-12 h-12 text-gray-400 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomSkeleton
