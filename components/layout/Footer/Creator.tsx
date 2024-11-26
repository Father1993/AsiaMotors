const Creator = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-2 border-t border-gray-800">
            <div className="group relative inline-block">
                <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-all duration-300">
                    <svg
                        className="w-5 h-5 text-purple-500 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                    </svg>
                    <span className="text-[10px]">Разработка</span>

                    <a
                        href="https://spinej.ru"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 transition-all duration-300 text-[10px]"
                    >
                        Spinej Andrej
                    </a>
                </div>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block transition-all duration-300">
                    <div className="bg-gray-800 text-xs text-gray-300 py-1 px-3 rounded-full whitespace-nowrap">
                        Нажмите, чтобы посмотреть другие проекты
                    </div>
                    <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
            </div>
        </div>
    )
}

export default Creator
