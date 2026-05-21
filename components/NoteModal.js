// components/NoteModal.js
'use client'

import { useState } from 'react'
import { X, Palette, Tag as TagIcon, Folder } from 'lucide-react'
import toast from 'react-hot-toast'

const colors = ['purple', 'blue', 'green', 'orange', 'pink']
const categories = ['personal', 'work', 'learning', 'ideas']

export default function NoteModal({ note, onClose, onSave }) {
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: note?.title || '',
        content: note?.content || '',
        category: note?.category || 'personal',
        color: note?.color || 'purple',
        tags: note?.tags || [],
        is_pinned: note?.is_pinned || false,
    })

    const [tagInput, setTagInput] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isSaving) return

        setIsSaving(true)

        const isEditing = !!note
        const actionText = isEditing ? 'Updating' : 'Creating'
        const loadingToast = toast.loading(`${actionText} note...`)

        const url = note ? `/api/notes/${note.id}` : '/api/notes'
        const method = note ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                toast.success(`Note ${isEditing ? 'updated' : 'created'} successfully!`, {
                    id: loadingToast,
                    duration: 3000
                })
                onSave() // This will close the modal and refresh notes
            } else {
                const error = await response.json()
                throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} note`)
            }
        } catch (error) {
            console.error('Error saving note:', error)
            toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} note. Please try again.`, {
                id: loadingToast,
                duration: 4000
            })
        } finally {
            setIsSaving(false)
        }
    }

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            })
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        })
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#111111] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-[#222222] p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {note ? 'Edit Note' : 'New Note'}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-[#888888]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={isSaving}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222222] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Note title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2">Content</label>
                        <textarea
                            required
                            rows="6"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            disabled={isSaving}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222222] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Write your note here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                                <Folder className="w-4 h-4" />
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                disabled={isSaving}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222222] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Color
                            </label>
                            <div className="flex gap-2">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => !isSaving && setFormData({ ...formData, color })}
                                        disabled={isSaving}
                                        className={`w-8 h-8 rounded-full transition-all ${color === 'purple' ? 'bg-purple-500' :
                                                color === 'blue' ? 'bg-blue-500' :
                                                    color === 'green' ? 'bg-green-500' :
                                                        color === 'orange' ? 'bg-orange-500' : 'bg-pink-500'
                                            } ${formData.color === color ? 'ring-2 ring-offset-2 dark:ring-offset-[#111111] ring-gray-400' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#888888] mb-2 flex items-center gap-2">
                            <TagIcon className="w-4 h-4" />
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                disabled={isSaving}
                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222222] rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                disabled={isSaving}
                                className="px-4 py-2 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#888888] rounded-lg hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#888888] text-sm rounded-lg">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            disabled={isSaving}
                                            className="hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.is_pinned}
                            onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                            disabled={isSaving}
                            className="w-4 h-4 rounded border-gray-300 dark:border-[#222222] text-purple-600 dark:text-[#8B5CF6] focus:ring-purple-500 dark:focus:ring-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-gray-700 dark:text-[#888888]">Pin this note</span>
                    </label>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {note ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                note ? 'Update Note' : 'Create Note'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#888888] rounded-lg hover:bg-gray-200 dark:hover:bg-[#222222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}