// components/CustomToaster.jsx (enhanced version)
'use client'

import { Toaster } from 'react-hot-toast'

export default function CustomToaster() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: '!bg-white dark:!bg-[#111111] !text-gray-900 dark:!text-white !border !border-gray-200 dark:!border-[#222222] !rounded-xl !shadow-lg !p-3 !text-sm',
                success: {
                    className: '!bg-green-50 dark:!bg-green-950/50 !text-green-700 dark:!text-green-400 !border !border-green-200 dark:!border-green-900',
                },
                error: {
                    className: '!bg-red-50 dark:!bg-red-950/50 !text-red-700 dark:!text-red-400 !border !border-red-200 dark:!border-red-900',
                },
                loading: {
                    className: '!bg-purple-50 dark:!bg-purple-950/50 !text-purple-700 dark:!text-purple-400 !border !border-purple-200 dark:!border-purple-900',
                },
            }}
        />
    )
}