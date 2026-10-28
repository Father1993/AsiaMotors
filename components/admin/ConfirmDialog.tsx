'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    pending,
    onClose,
    onConfirm,
}: {
    open: boolean
    title: string
    description: string
    confirmLabel: string
    pending: boolean
    onClose: () => void
    onConfirm: () => void
}) {
    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!pending) onClose()
            }}
            className="admin-shell admin-confirm-root"
        >
            <DialogBackdrop className="admin-confirm-backdrop" />
            <div className="admin-confirm-container">
                <DialogPanel className="admin-panel admin-confirm-panel">
                    <DialogTitle as="h2">{title}</DialogTitle>
                    <Description className="admin-muted">{description}</Description>
                    <div className="admin-confirm-actions">
                        <button
                            type="button"
                            data-autofocus
                            className="admin-button"
                            disabled={pending}
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            className="admin-button admin-button-primary"
                            disabled={pending}
                            onClick={onConfirm}
                        >
                            {pending ? 'Подождите…' : confirmLabel}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
