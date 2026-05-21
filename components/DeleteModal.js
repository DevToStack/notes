// components/DeleteModal.js
'use client'

import { AlertTriangle } from 'lucide-react'

export default function DeleteModal({ note, onConfirm, onClose }) {
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
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            Delete Note
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#888888] rounded-lg hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}