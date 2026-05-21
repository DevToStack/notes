// components/DeleteModal.js
'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DeleteModal({ note, onConfirm, onClose }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleConfirm = async () => {
        if (isDeleting) return

        setIsDeleting(true)

        // Show loading toast
        const loadingToast = toast.loading('Deleting note...')

        try {
            // Call the delete function
            await onConfirm()

            // Update toast to success
            toast.success('Note deleted successfully!', {
                id: loadingToast,
                duration: 3000
            })

            // Immediately close modal
            onClose()
        } catch (error) {
            // Update toast to error
            toast.error('Failed to delete note. Please try again.', {
                id: loadingToast,
                duration: 4000
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#111111] rounded-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Note</h3>
                    </div>

                    <p className="text-gray-600 dark:text-[#888888] mb-2">
                        Are you sure you want to delete <span className="text-gray-900 dark:text-white font-semibold">"{note.title}"</span>?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-[#888888] mb-6">
                        This action cannot be undone. The note will be permanently deleted.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Note'
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#888888] rounded-lg hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}