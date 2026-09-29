import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the core routes that demand authentication
const protectedRoutes = ['/dashboard', '/profile', '/jobs/apply'];

// Define routes strictly for unverified/unauthenticated users
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // 1. Prevent unauthenticated access to protected routes
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // 2. Prevent authenticated users from visiting the login/register pages again
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure middleware only fires on necessary URL arrays to optimize Edge execution
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/jobs/apply/:path*',
    '/login',
    '/register'
  ],
};
