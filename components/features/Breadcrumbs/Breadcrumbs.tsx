import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { BreadcrumbsProps } from '@/shared/types/breadcrumbs'

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 mt-10">
            <Link href="/" className="hover:text-red-600 transition-colors">
                Главная
            </Link>

            {items.map((item, index) => (
                <div key={item.href} className="flex items-center">
                    <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
                    {index === items.length - 1 ? (
                        <span className="text-gray-800 font-medium">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            href={item.href}
                            className="hover:text-red-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    )
}

export default Breadcrumbs
