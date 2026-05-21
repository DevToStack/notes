import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {query} from '@/lib/db';
import { cookies } from 'next/headers';

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

        // Get user from database
        const users = await query(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ user: users[0], success: true }, { status: 200 });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}