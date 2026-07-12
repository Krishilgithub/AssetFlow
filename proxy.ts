import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/settings'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('refresh_token')?.value;

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login-in', request.url));
  }

  if ((request.nextUrl.pathname === '/login-in' || request.nextUrl.pathname === '/sign-up') && token) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login-in', '/sign-up'],
};
