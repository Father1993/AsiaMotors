import type { ReactNode } from 'react'

export function Field({
    name,
    label,
    hint,
    error,
    children,
    className,
}: {
    name: string
    label: string
    hint?: string
    error?: string
    children: ReactNode
    className?: string
}) {
    return (
        <div className={['admin-field', className].filter(Boolean).join(' ')}>
            <label htmlFor={name}>{label}</label>
            {hint && (
                <p id={name + '-hint'} className="admin-muted">
                    {hint}
                </p>
            )}
            {children}
            {error && (
                <p id={name + '-error'} className="admin-field-error">
                    {error}
                </p>
            )}
        </div>
    )
}
