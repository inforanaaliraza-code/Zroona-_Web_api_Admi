import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/myBooking',
  '/myEvents',
  '/welcomeUsEvent',
  '/joinUsEvent',
  '/create-event',
  '/profile',
  '/messaging',
  '/myReviews',
  '/(organizer)',
];

// Public routes that should not require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/termsCondition',
  '/privacyPolicy',
  '/aboutUs',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get('authToken')?.value;
  const userToken = request.cookies.get('userToken')?.value;
  const authToken = token || userToken;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || (route.startsWith('/(') && pathname !== '/')
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If protected route and no auth token, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If public auth route and has token, redirect to home
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
