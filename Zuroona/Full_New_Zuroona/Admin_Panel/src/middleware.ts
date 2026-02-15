import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected admin routes
const protectedRoutes = [
  '/adminsa111xyz',
  '/(AfterLogin)',
];

// Public routes for admins
const publicRoutes = [
  '/auth/login',
  '/auth/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Get admin auth token
  const adminToken = request.cookies.get('adminAuth')?.value;
  const adminTokenAlt = request.cookies.get('token')?.value;
  const token = adminToken || adminTokenAlt;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.startsWith('/(')) {
      // Handle group routes like '/(AfterLogin)'
      return pathname.includes('/dashboard') || pathname.includes('/events') || pathname.includes('/users');
    }
    return pathname.startsWith(route);
  });

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If protected route and no auth token, redirect to admin login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access auth routes with valid token, redirect to dashboard
  if ((pathname === '/auth/login' || pathname === '/auth/forgot-password') && token) {
    return NextResponse.redirect(new URL('/adminsa111xyz', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public/* (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
