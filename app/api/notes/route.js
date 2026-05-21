// app/api/notes/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET /api/notes - Get all notes
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const archived = searchParams.get('archived') === 'true'
        const category = searchParams.get('category')

        let sqlQuery = 'SELECT * FROM notes WHERE is_archived = ?'
        const params = [archived ? 1 : 0]

        if (category && category !== 'all') {
            sqlQuery += ' AND category = ?'
            params.push(category)
        }

        sqlQuery += ' ORDER BY is_pinned DESC, updated_at DESC'

        const notes = await query(sqlQuery, params)

        // Parse tags JSON
        const parsedNotes = notes.map(note => ({
            ...note,
            tags: note.tags || []
        }))

        return NextResponse.json({ success: true, notes: parsedNotes })
    } catch (error) {
        console.error('Error fetching notes:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notes' },
            { status: 500 }
        )
    }
}

// POST /api/notes - Create new note
export async function POST(request) {
    try {
        const body = await request.json()
        const { title, content, category, color, tags, is_pinned } = body

        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: 'Title and content are required' },
                { status: 400 }
            )
        }

        const tagsString = tags ? JSON.stringify(tags) : null

        const result = await query(
            `INSERT INTO notes (title, content, category, color, tags, is_pinned)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, content, category || 'personal', color || 'purple', tagsString, is_pinned || false]
        )

        return NextResponse.json({
            success: true,
            message: 'Note created successfully',
            noteId: result.insertId
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating note:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create note' },
            { status: 500 }
        )
    }
}