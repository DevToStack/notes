// components/Sidebar.js
'use client'

import { useState, useEffect } from 'react'
import {
    Home,
    Star,
    Archive,
    FolderTree,
    Settings,
    Plus,
    Sparkles,
    Calendar,
    TrendingUp,
    Clock,
    Menu,
    X
} from 'lucide-react'

export default function Sidebar({
    activeView,
    onViewChange,
    categories,
    selectedCategory,
    onCategorySelect,
    tags,
    selectedTag,
    onTagSelect,
    stats,
    onNewNote,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    onOpenProfile
}) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (isMobileMenuOpen && isMobile) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isMobileMenuOpen, isMobile])

    const menuItems = [
        { id: 'all', label: 'All Notes', icon: Home, count: stats?.all || 0 },
        { id: 'pinned', label: 'Pinned', icon: Star, count: stats?.pinned || 0 },
        { id: 'archived', label: 'Archived', icon: Archive, count: stats?.archived || 0 },
        { id: 'recent', label: 'Recently Updated', icon: Clock, count: stats?.recent || 0 },
    ]

    const smartViews = [
        { id: 'today', label: 'Today', icon: Calendar, count: stats?.today || 0 },
        { id: 'week', label: 'This Week', icon: TrendingUp, count: stats?.week || 0 },
    ]

    const SidebarContent = () => (
        <div className="flex flex-col">
            {/* New Note Button */}
            <div className="p-4">
                <button
                    onClick={() => {
                        onNewNote()
                        if (isMobile) setIsMobileMenuOpen(false)
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED] text-white rounded-xl transition-all duration-200 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span className="text-sm font-medium">New Note</span>
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="px-3 space-y-6">
                <div>
                    <p className="px-3 text-xs font-semibold text-gray-400 dark:text-[#666666] uppercase tracking-wider mb-3">
                        Menu
                    </p>
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeView === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onViewChange(item.id)
                                        if (isMobile) setIsMobileMenuOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-[#8B5CF6]'
                                        : 'text-gray-600 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-[#8B5CF6]' : ''}`} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    {item.count > 0 && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive
                                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-[#8B5CF6]'
                                            : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-500 dark:text-[#888888]'
                                            }`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <p className="px-3 text-xs font-semibold text-gray-400 dark:text-[#666666] uppercase tracking-wider mb-3">
                        Smart Views
                    </p>
                    <div className="space-y-1">
                        {smartViews.map((item) => {
                            const Icon = item.icon
                            const isActive = activeView === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onViewChange(item.id)
                                        if (isMobile) setIsMobileMenuOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-[#8B5CF6]'
                                        : 'text-gray-600 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    {item.count > 0 && (
                                        <span className="text-xs text-gray-500 dark:text-[#888888]">{item.count}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {categories && categories.length > 0 && (
                    <div>
                        <p className="px-3 text-xs font-semibold text-gray-400 dark:text-[#666666] uppercase tracking-wider mb-3">
                            Categories
                        </p>
                        <div className="space-y-1">
                            {categories.map((category) => {
                                const isActive = selectedCategory === category.id && activeView === 'category'
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            onCategorySelect(category.id)
                                            onViewChange('category')
                                            if (isMobile) setIsMobileMenuOpen(false)
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-[#8B5CF6]'
                                            : 'text-gray-600 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FolderTree className="w-4 h-4" />
                                            <span className="text-sm font-medium capitalize">{category.id}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-[#888888]">{category.count}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {tags && tags.length > 0 && (
                    <div>
                        <p className="px-3 text-xs font-semibold text-gray-400 dark:text-[#666666] uppercase tracking-wider mb-3">
                            Popular Tags
                        </p>
                        <div className="flex flex-wrap gap-2 px-3 pb-4">
                            {tags.slice(0, 8).map((tag) => {
                                const isActive = selectedTag === tag.name && activeView === 'tag'
                                return (
                                    <button
                                        key={tag.name}
                                        onClick={() => {
                                            onTagSelect(tag.name)
                                            onViewChange('tag')
                                            if (isMobile) setIsMobileMenuOpen(false)
                                        }}
                                        className={`px-2 py-1 rounded-md text-xs transition-all duration-200 ${isActive
                                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-[#8B5CF6]'
                                            : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#888888] hover:bg-gray-200 dark:hover:bg-[#222222]'
                                            }`}
                                    >
                                        #{tag.name}
                                        <span className="ml-1 text-xs opacity-60">{tag.count}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && !isMobileMenuOpen && (
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#222222] shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
            )}

            {/* Mobile Overlay */}
            {isMobile && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 40,
                        transition: 'opacity 0.5s ease-out',
                        opacity: isMobileMenuOpen ? 1 : 0,
                        visibility: isMobileMenuOpen ? 'visible' : 'hidden',
                        pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                style={{
                    position: isMobile ? 'fixed' : 'sticky',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    maxHeight: '100dvh',
                    width: isMobile ? '320px' : '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 50,
                    boxShadow: isMobile && isMobileMenuOpen ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)'
                }}
                className=" bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#222222]"
            >
                {/* Mobile Header with Close Button */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#222222]">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">NotesApp</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all duration-200 hover:scale-105 active:scale-95"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5 text-gray-700 dark:text-white" />
                        </button>
                    </div>
                )}

                {/* Sidebar Content */}
                <div className="overflow-y-auto">
                    {!isMobile && (
                        <div className="p-6 border-b border-gray-200 dark:border-[#222222]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">NotesApp</h1>
                                    <p className="text-xs text-gray-500 dark:text-[#888888]">Organize your thoughts</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <SidebarContent />

                </div>
                <div className="p-4 border-t border-gray-200 dark:border-[#222222]">
                    <button
                        onClick={() => {
                            onOpenProfile()
                            if (isMobile) setIsMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-[#888888] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm font-medium">Settings</span>
                    </button>

                    <div className="mt-4">
                        <div className="bg-gray-100 dark:bg-[#1A1A1A] rounded-lg p-3">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-[#888888] mb-1">
                                <span>Storage</span>
                                <span>{stats?.storageUsed || 0}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-[#222222] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300"
                                    style={{ width: `${stats?.storageUsed || 0}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-[#666666] mt-2">
                                {stats?.notesCount || 0} notes • {stats?.tagsCount || 0} tags
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}