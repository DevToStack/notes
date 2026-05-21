// app/api/auth/update-profile/route.js
import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(request) {
    try {
        // Get token from cookies
        const parseCookies = await cookies()
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

        const { username, email, currentPassword, newPassword } = await request.json();

        // Validate input
        if (!username || !email) {
            return NextResponse.json(
                { error: 'Username and email are required' },
                { status: 400 }
            );
        }

        // Check if email or username already exists for other users
        const existingUsers = await query(
            'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?',
            [email, username, decoded.userId]
        );

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: 'Email or username already taken' },
                { status: 409 }
            );
        }

        // Get current user data
        const users = await query(
            'SELECT * FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = users[0];

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { error: 'Current password is required to change password' },
                    { status: 400 }
                );
            }

            const isValidPassword = await comparePassword(currentPassword, user.password);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 401 }
                );
            }

            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: 'New password must be at least 6 characters' },
                    { status: 400 }
                );
            }

            // Hash new password
            const hashedPassword = await hashPassword(newPassword);

            // Update all fields including password
            await query(
                'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
                [username, email, hashedPassword, decoded.userId]
            );
        } else {
            // Update without changing password
            await query(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [username, email, decoded.userId]
            );
        }

        return NextResponse.json(
            { message: 'Profile updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}