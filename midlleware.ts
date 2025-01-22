// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add debug logging
  console.log('Middleware running for path:', request.nextUrl.pathname)
  console.log('Auth token:', !!request.cookies.get('auth-token')?.value)
  console.log('User role:', request.cookies.get('user-role')?.value)

  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value

  // Protected routes configuration
  const protectedRoutes = {
    '/admin': ['admin'],
    '/dashboard/author': ['author'],
    '/dashboard/reviewer': ['reviewer']
  }

  // Check if current path matches any protected route
  const matchedPath = Object.keys(protectedRoutes).find(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  )

  if (matchedPath) {
    // No auth token - redirect to login
    if (!authToken) {
      console.log('No auth token - redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user has required role
    const requiredRoles = protectedRoutes[matchedPath]
    if (!requiredRoles.includes(userRole as string)) {
      console.log('Invalid role - redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

// Update config to match exact paths and their children
export const config = {
  matcher: [
    '/',
    '/admin',
    '/admin/:path*',
    '/dashboard/author/:path*',
    '/dashboard/reviewer/:path*',
    '/auth/login',
    '/auth/signup'
  ]
}