import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the secure cookie exists
  const authCookie = request.cookies.get('ecolens-admin-auth')

  // If someone tries to access ANY route starting with /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authCookie || authCookie.value !== 'verified') {
      // Boot them to the secure login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Allow the request to proceed if everything is safe
  return NextResponse.next()
}

// Specifically target the dashboard and any future admin routes (like settings)
export const config = {
  matcher: ['/dashboard/:path*'],
}