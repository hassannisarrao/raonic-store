import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user has the secret cookie from our custom login page
  const authCookie = request.cookies.get('raonic_admin_auth');
  
  // If they are trying to access the /admin folder (but NOT the login page itself)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // If they don't have the cookie, redirect them to our beautiful new custom login screen
    if (!authCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Otherwise, let them pass
  return NextResponse.next();
}

// Tell Next.js to only run this security check on /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};