// app/api/notes/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/notes - Get all notes
export async function GET(request) {
    try {
        const parseCookies = await cookies()
        // Get token from cookies
        const token = parseCookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url)
        const archived = searchParams.get('archived') === 'true'
        const category = searchParams.get('category')

        let sqlQuery = 'SELECT * FROM notes WHERE is_archived = ? AND userid = ?'
        const params = [archived ? 1 : 0, decoded.userId]

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
        const parseCookies = await cookies()
        // Get token from cookies
        const token = parseCookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

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
            `INSERT INTO notes (userid, title, content, category, color, tags, is_pinned)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [decoded.userId, title, content, category || 'personal', color || 'purple', tagsString, is_pinned || false]
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