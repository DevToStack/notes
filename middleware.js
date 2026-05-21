import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function middleware(request) {
    const cookieParse = await cookies();

    const token = cookieParse.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Verify token
    let isValidToken = false;
    if (token) {
        const decoded = verifyToken(token);
        isValidToken = !!decoded;
    }

    // Redirect logic
    if (isValidToken && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isValidToken && !isPublicRoute && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register'
    ]
};