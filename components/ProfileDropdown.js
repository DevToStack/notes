// components/ProfileDropdown.js
'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Mail, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProfileDropdown({ user, onOpenSettings }) {
    const [isOpen, setIsOpen] = useState(false)
    const [userData, setUserData] = useState(user)
    const dropdownRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/me')
            const data = await response.json()
            if (response.ok && data.user) {
                setUserData(data.user)
            }
        } catch (error) {
            console.error('Error fetching user:', error)
        }
    }

    const handleLogout = async () => {
        const loadingToast = toast.loading('Logging out...')

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            })

            if (response.ok) {
                toast.success('Logged out successfully!', {
                    id: loadingToast,
                    duration: 2000
                })

                // Redirect to login page
                setTimeout(() => {
                    router.push('/login')
                    router.refresh()
                }, 1000)
            } else {
                throw new Error('Logout failed')
            }
        } catch (error) {
            console.error('Error logging out:', error)
            toast.error('Failed to logout', {
                id: loadingToast,
                duration: 3000
            })
        }
    }

    const getInitials = () => {
        if (!userData?.username) return '?'
        return userData.username.charAt(0).toUpperCase()
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors group"
            >
                {/* Circular Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials()}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-[#888888] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-200 dark:border-[#222222]">
                        <div className="flex items-center gap-3">
                            {/* Large Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                                {getInitials()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {userData?.username || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#888888] truncate flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {userData?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                onOpenSettings()
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}