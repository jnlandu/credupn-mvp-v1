// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
//   const isAuthenticated = request.cookies.get('admin-token')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

   // Check role from token if available
   const userRole = request.cookies.get('user-role')?.value

  if (isAdminRoute) {
    if (!authToken || userRole !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
  }
  if (isDashboardPage && !authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (isAuthPage && authToken) {
     // Redirect based on role
    if (userRole === 'admin') {
    //     return NextResponse.redirect(new URL('/admin', request.url))
    //   } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
  }

  return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*','/dashboard/:path*', '/auth/:path*']
}