// components/NoteCard.js - Add random height for masonry effect
'use client'

import { Pin, Archive, Trash2, Edit, Calendar, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'

const colorStyles = {
    purple: 'border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40',
    blue: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
    green: 'border-green-500/20 bg-green-500/5 hover:border-green-500/40',
    orange: 'border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40',
    pink: 'border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40',
}

export default function NoteCard({ note, view, onEdit, onDelete, onArchive, onPin }) {
    const [randomHeight, setRandomHeight] = useState('')

    useEffect(() => {
        // Random heights for masonry effect (only in grid view)
        if (view === 'grid') {
            const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80']
            setRandomHeight(heights[Math.floor(Math.random() * heights.length)])
        }
    }, [view])
    
    // Grid view with masonry layout
    return (
        <div className="break-inside-avoid mb-4">
            <div
                className={`card group relative bg-white dark:bg-[#111111]
  rounded-xl border overflow-hidden
  ${colorStyles[note.color] || colorStyles.purple}`}
            >
                {/* Pin Indicator */}
                {note.is_pinned !== 0 && (
                    <div className="absolute top-3 right-3 z-10">
                        <Pin className="w-3.5 h-3.5 text-purple-500 dark:text-[#8B5CF6] fill-purple-500 dark:fill-[#8B5CF6]" />
                    </div>
                )}

                {/* Color bar at top */}
                <div className={`h-1 w-full ${note.color === 'purple' ? 'bg-purple-500' :
                    note.color === 'blue' ? 'bg-blue-500' :
                        note.color === 'green' ? 'bg-green-500' :
                            note.color === 'orange' ? 'bg-orange-500' : 'bg-pink-500'
                    }`} />

                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {note.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-[#888888] leading-relaxed line-clamp-4 mb-3">
                        {note.content}
                    </p>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {note.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#888888] text-xs rounded">
                                    <Tag className="w-2.5 h-2.5 inline mr-1" />
                                    {tag}
                                </span>
                            ))}
                            {note.tags.length > 3 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#888888] text-xs rounded">
                                    +{note.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#222222]">
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-[#666666]">
                            <Calendar className="w-3 h-3" />
                            {new Date(note.updated_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => onPin(note)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors" title={note.is_pinned ? 'Unpin' : 'Pin'}>
                                <Pin className="w-3 h-3 text-gray-500 dark:text-[#888888]" />
                            </button>
                            <button onClick={() => onArchive(note)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors" title={note.is_archived ? 'Unarchive' : 'Archive'}>
                                <Archive className="w-3 h-3 text-gray-500 dark:text-[#888888]" />
                            </button>
                            <button onClick={() => onEdit(note)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors" title="Edit">
                                <Edit className="w-3 h-3 text-blue-500" />
                            </button>
                            <button onClick={() => onDelete(note)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                                <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}