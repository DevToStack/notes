// app/page.js
'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Pin } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import NoteCard from '@/components/NoteCard'
import NoteModal from '@/components/NoteModal'
import DeleteModal from '@/components/DeleteModal'
import ThemeToggle from '@/components/ThemeToggle'

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeView, setActiveView] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [stats, setStats] = useState({})
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [activeView, selectedCategory, selectedTag])

  const fetchNotes = async () => {
    try {
      let url = '/api/notes?'

      if (activeView === 'archived') {
        url += 'archived=true'
      } else if (activeView === 'category' && selectedCategory) {
        url += `category=${selectedCategory}`
      } else if (activeView !== 'archived') {
        url += 'archived=false'
      }

      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        let filteredNotes = data.notes

        if (activeView === 'pinned') {
          filteredNotes = filteredNotes.filter(note => note.is_pinned === 1)
        } else if (activeView === 'recent') {
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          filteredNotes = filteredNotes.filter(note => new Date(note.updated_at) > sevenDaysAgo)
        } else if (activeView === 'today') {
          const today = new Date().toDateString()
          filteredNotes = filteredNotes.filter(note => new Date(note.updated_at).toDateString() === today)
        } else if (activeView === 'week') {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          filteredNotes = filteredNotes.filter(note => new Date(note.updated_at) > weekAgo)
        } else if (activeView === 'tag' && selectedTag) {
          filteredNotes = filteredNotes.filter(note => note.tags?.includes(selectedTag))
        }

        setNotes(filteredNotes)
        calculateStats(data.notes)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (allNotes) => {
    const activeNotes = allNotes.filter(n => !n.is_archived)
    const archivedNotes = allNotes.filter(n => n.is_archived)
    const pinnedNotes = activeNotes.filter(n => n.is_pinned === 1)

    const today = new Date().toDateString()
    const todayNotes = activeNotes.filter(n => new Date(n.updated_at).toDateString() === today)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekNotes = activeNotes.filter(n => new Date(n.updated_at) > weekAgo)

    const allTags = new Set()
    activeNotes.forEach(note => {
      note.tags?.forEach(tag => allTags.add(tag))
    })

    const categoryCounts = {}
    activeNotes.forEach(note => {
      categoryCounts[note.category] = (categoryCounts[note.category] || 0) + 1
    })

    const categories = Object.keys(categoryCounts).map(cat => ({
      id: cat,
      count: categoryCounts[cat]
    }))

    const tags = Array.from(allTags).map(tag => ({
      name: tag,
      count: activeNotes.filter(n => n.tags?.includes(tag)).length
    }))

    setStats({
      all: activeNotes.length,
      pinned: pinnedNotes.length,
      archived: archivedNotes.length,
      recent: weekNotes.length,
      today: todayNotes.length,
      week: weekNotes.length,
      notesCount: allNotes.length,
      tagsCount: tags.length,
      storageUsed: Math.min(Math.floor((allNotes.length / 100) * 100), 100),
      categories,
      tags
    })
  }

  const handleDeleteClick = (note) => {
    setNoteToDelete(note)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return

    try {
      const response = await fetch(`/api/notes/${noteToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        fetchNotes()
        setShowDeleteModal(false)
        setNoteToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleArchive = async (note) => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, is_archived: !note.is_archived })
      })

      if (response.ok) {
        fetchNotes()
      }
    } catch (error) {
      console.error('Error archiving note:', error)
    }
  }

  const handlePin = async (note) => {
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, is_pinned: note.is_pinned === 1 ? 0 : 1 })
      })

      if (response.ok) {
        fetchNotes()
      }
    } catch (error) {
      console.error('Error pinning note:', error)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter(note => note.is_pinned === 1)
  const unpinnedNotes = filteredNotes.filter(note => note.is_pinned !== 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-[#8B5CF6] mb-4"></div>
          <p className="text-gray-600 dark:text-[#888888]">Loading notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view)
          if (view !== 'category') setSelectedCategory(null)
          if (view !== 'tag') setSelectedTag(null)
        }}
        categories={stats.categories || []}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        tags={stats.tags || []}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        stats={stats}
        onNewNote={() => {
          setEditingNote(null)
          setShowModal(true)
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gray-200 dark:border-[#222222]">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="ml-12 sm:ml-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeView === 'all' && 'All Notes'}
                  {activeView === 'pinned' && 'Pinned Notes'}
                  {activeView === 'archived' && 'Archived Notes'}
                  {activeView === 'recent' && 'Recently Updated'}
                  {activeView === 'today' && "Today's Notes"}
                  {activeView === 'week' && 'This Week'}
                  {activeView === 'category' && `Category: ${selectedCategory}`}
                  {activeView === 'tag' && `Tag: #${selectedTag}`}
                  {activeView === 'settings' && 'Settings'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-[#888888]">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#888888]" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#8B5CF6]"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Notes Masonry Grid */}
        <div className="p-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-[#111111] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 dark:text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
              <p className="text-gray-500 dark:text-[#888888]">Create your first note to get started</p>
            </div>
          ) : (
            <>
              {pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-[#888888] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Pin className="w-4 h-4" />
                    Pinned
                  </h2>
                  <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={setEditingNote}
                        onDelete={handleDeleteClick}
                        onArchive={handleArchive}
                        onPin={handlePin}
                      />
                    ))}
                  </div>
                </div>
              )}

              {unpinnedNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-[#888888] uppercase tracking-wider mb-4">
                      Others
                    </h2>
                  )}
                  <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={setEditingNote}
                        onDelete={handleDeleteClick}
                        onArchive={handleArchive}
                        onPin={handlePin}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {showModal && (
        <NoteModal
          note={editingNote}
          onClose={() => {
            setShowModal(false)
            setEditingNote(null)
          }}
          onSave={() => {
            fetchNotes()
            setShowModal(false)
            setEditingNote(null)
          }}
        />
      )}

      {showDeleteModal && noteToDelete && (
        <DeleteModal
          note={noteToDelete}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDeleteModal(false)
            setNoteToDelete(null)
          }}
        />
      )}
    </div>
  )
}