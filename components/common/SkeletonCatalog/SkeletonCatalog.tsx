import { SkeletonProps } from '@/shared/types/common'

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200/60 ${
                className || ''
            }`}
            {...props}
        />
    )
}

export default Skeleton
