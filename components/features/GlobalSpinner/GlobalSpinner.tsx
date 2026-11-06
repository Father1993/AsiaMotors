const GlobalSpinner = () => {
    return (
        <div
            role="status"
            className="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-white/90"
        >
            <div className="flex flex-col items-center gap-4">
                <div aria-hidden="true" className="relative grid h-20 w-36 place-items-center">
                    <svg
                        viewBox="0 0 144 80"
                        className="absolute inset-0 h-full w-full"
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                    >
                        <path d="M9 63h38M20 71h42M34 55h14" stroke="#cbd5e1" />
                        <path d="M27 63h22M39 71h23" stroke="#dc2626" />
                    </svg>
                    <svg
                        viewBox="0 0 72 72"
                        className="relative h-[72px] w-[72px] motion-safe:animate-[spin_1.4s_linear_infinite]"
                    >
                        <circle cx="36" cy="36" r="34" fill="#111827" />
                        <circle cx="36" cy="36" r="29" fill="none" stroke="#475569" strokeWidth="2" />
                        <circle cx="36" cy="36" r="23" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                        {[0, 72, 144, 216, 288].map((angle) => (
                            <path
                                key={angle}
                                d="M33 31 30 15l7-1 3 17z"
                                fill="#e2e8f0"
                                transform={`rotate(${angle} 36 36)`}
                            />
                        ))}
                        <circle cx="36" cy="36" r="7" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" />
                        <circle cx="36" cy="36" r="3" fill="#dc2626" />
                    </svg>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                    Загрузка…
                </span>
            </div>
        </div>
    )
}

export default GlobalSpinner
