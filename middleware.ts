import { NextResponse, type NextRequest } from 'next/server';

/**
 * Firebase Authentication Middleware
 * Note: Firebase Auth verification in middleware requires the Firebase Admin SDK
 * For now, we'll check for the presence of auth cookies set by Firebase client
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  // Get the session cookie set by Firebase Auth
  const sessionCookie = request.cookies.get('__session')?.value;

  // Define public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isHomeRoute = request.nextUrl.pathname === '/';

  // If user is not authenticated and trying to access protected route
  if (!sessionCookie && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is authenticated and accessing home, redirect to dashboard
  if (sessionCookie && isHomeRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (sessionCookie && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};