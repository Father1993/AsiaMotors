import { CarCardSkeletonProps } from '@/shared/types/common'
import Skeleton from './SkeletonCatalog'

export function CarCardSkeleton({ viewMode }: CarCardSkeletonProps) {
    const gridSkeleton = (
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg p-6 mb-12">
            {/* Скелетон изображения */}
            <div className="relative aspect-[16/9] mb-6">
                <Skeleton className="absolute inset-0" />
            </div>

            {/* Скелетон заголовка и цены */}
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-7 w-28" />
            </div>

            {/* Скелетон характеристик */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>

            {/* Скелетон кнопок */}
            <div className="flex gap-4">
                <Skeleton className="flex-1 h-12 rounded-xl" />
                <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
        </div>
    )

    const listSkeleton = (
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex pb-12">
            {/* Скелетон изображения */}
            <div className="relative w-1/3">
                <Skeleton className="absolute inset-0" />
            </div>

            {/* Контент */}
            <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>

                {/* Скелетон характеристик */}
                <div className="flex flex-wrap gap-6 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Скелетон кнопок */}
                <div className="flex gap-4">
                    <Skeleton className="flex-1 h-12 rounded-xl" />
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
            </div>
        </div>
    )

    return viewMode === 'grid' ? gridSkeleton : listSkeleton
}
