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

  // Client-side useEffect handles role-based redirection from login/sign-up
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login-in', '/sign-up'],
};
