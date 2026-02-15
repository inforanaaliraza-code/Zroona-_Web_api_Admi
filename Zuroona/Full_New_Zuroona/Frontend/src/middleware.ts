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
  '/login',
  '/signup',
  '/organizerSignup',
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

  // Get auth token from cookies (app uses TOKEN_NAME = "Zuroona")
  const authToken = request.cookies.get('Zuroona')?.value || request.cookies.get('authToken')?.value || request.cookies.get('userToken')?.value;

  // Check if route is public first - allow unauthenticated access to signup, etc.
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => {
    const normalized = route.replace(/[()]/g, "");
    return pathname.startsWith(normalized);
  });

  // If protected route and no auth token, redirect to login (short param: r=path)
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('r', pathname.startsWith('/') ? pathname.slice(1) : pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged-in user visits /login or /signup, redirect to dashboard (respect r= param)
  if ((pathname.startsWith('/login') || pathname.startsWith('/signup')) && authToken) {
    const r = request.nextUrl.searchParams.get('r');
    const target = r ? (r.startsWith('/') ? r : `/${r}`) : '/';
    return NextResponse.redirect(new URL(target, request.url));
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
