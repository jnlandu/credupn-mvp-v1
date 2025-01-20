// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('admin-token')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}