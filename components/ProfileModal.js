// components/ProfileModal.js
'use client'

import { useState, useEffect } from 'react'
import { X, User, Mail, Lock, Key, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfileModal({ onClose, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/auth/me')
            const data = await response.json()

            if (response.ok && data.user) {
                setFormData(prev => ({
                    ...prev,
                    username: data.user.username,
                    email: data.user.email
                }))
            } else {
                toast.error('Failed to load profile')
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('Failed to load profile')
        } finally {
            setIsFetching(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters'
            }
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to set a new password'
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        const loadingToast = toast.loading('Updating profile...')

        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
            }

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword
                updateData.newPassword = formData.newPassword
            }

            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Profile updated successfully!', {
                    id: loadingToast,
                    duration: 3000
                })
                onUpdate() // Refresh user data in parent
                setTimeout(() => {
                    onClose() // Close modal after success
                }, 1500)
            } else {
                throw new Error(data.error || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error(error.message, {
                id: loadingToast,
                duration: 4000
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-[#111111] rounded-xl max-w-md w-full p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-[#8B5CF6]"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#111111] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-[#222222] p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Settings
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-[#888888]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 ${errors.username ? 'border-red-500' : 'border-gray-200 dark:border-[#222222]'
                                }`}
                            placeholder="Enter username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-[#222222]'
                                }`}
                            placeholder="Enter email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-[#222222]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-[#111111] text-gray-500 dark:text-[#888888]">Change Password (Optional)</span>
                        </div>
                    </div>

                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 ${errors.currentPassword ? 'border-red-500' : 'border-gray-200 dark:border-[#222222]'
                                }`}
                            placeholder="Enter current password"
                        />
                        {errors.currentPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            New Password
                        </label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 ${errors.newPassword ? 'border-red-500' : 'border-gray-200 dark:border-[#222222]'
                                }`}
                            placeholder="Enter new password (optional)"
                        />
                        {errors.newPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    {formData.newPassword && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-[#222222]'
                                    }`}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#888888] rounded-lg hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}