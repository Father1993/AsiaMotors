export const iconVariants = {
    hidden: {
        scale: 0,
        opacity: 0,
        rotate: -180,
    },
    visible: (index: number) => ({
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2 + index * 0.2,
            duration: 0.8,
        },
    }),
    hover: {
        scale: 1.2,
        rotate: 15,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 10,
        },
    },
}

// Анимация для ошибок
export const errorVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 10,
        },
    },
    exit: {
        opacity: 0,
        y: 10,
        scale: 0.9,
        transition: {
            duration: 0.2,
        },
    },
}

export const toastConfig = {
    duration: 3000,

    style: {
        padding: '16px',
        borderRadius: '12px',
        background: '#333',
        color: '#fff',
    },

    success: {
        style: {
            background: '#10B981',
        },
    },

    error: {
        style: {
            background: '#EF4444',
        },
    },
}
