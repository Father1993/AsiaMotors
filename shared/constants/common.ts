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
