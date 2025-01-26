// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export  async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ request, res })
  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  return res
}

// Update config to match exact paths and their children
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}