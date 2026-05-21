// app/api/notes/[id]/route.js
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/notes/[id] - Get single note
export async function GET(request, { params }) {
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

        const { id } = await params

        const notes = await query(
            'SELECT * FROM notes WHERE id = ? AND userid = ?',
            [id, decoded.userId]
        )

        if (notes.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            )
        }

        const note = {
            ...notes[0],
            tags: notes[0].tags ? JSON.parse(notes[0].tags) : []
        }

        return NextResponse.json({ success: true, note })
    } catch (error) {
        console.error('Error fetching note:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch note' },
            { status: 500 }
        )
    }
}

// PUT /api/notes/[id] - Update note
export async function PUT(request, { params }) {
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

        const { id } = await params
        const body = await request.json()
        const { title, content, category, color, tags, is_pinned, is_archived } = body

        const tagsString = tags ? JSON.stringify(tags) : null

        await query(
            `UPDATE notes SET 
             title = ?, content = ?, category = ?, color = ?, 
             tags = ?, is_pinned = ?, is_archived = ?
             WHERE id = ?`,
            [title, content, category, color, tagsString, is_pinned || false, is_archived || false, id]
        )

        return NextResponse.json({
            success: true,
            message: 'Note updated successfully'
        })
    } catch (error) {
        console.error('Error updating note:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update note' },
            { status: 500 }
        )
    }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(request, { params }) {
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

        const { id } = await params

        await query('DELETE FROM notes WHERE id = ?', [id])

        return NextResponse.json({
            success: true,
            message: 'Note deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting note:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete note' },
            { status: 500 }
        )
    }
}