// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create Supabase client with cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      //   removeAll(cookiesList: string[], options?: CookieOptions) {
      //     cookiesList.forEach((name: any) => request.cookies.set(name, ''))
      //     response.cookies.set({
      //       name,
      //       value: '',
      //       ...options
      //     })
      //   }
      }
    }
  )

   // refreshing the auth token
  await supabase.auth.getUser()
  try {
    // Check auth session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userError || !userData || userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
    // For author routes, verify role and ID
    if (request.nextUrl.pathname.startsWith('/dashboard/author/')) {
      const authorId = request.nextUrl.pathname.split('/')[3]
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userError || !userData || userData.role !== 'author' || session.user.id !== authorId) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // Add auth user to request headers
    response.headers.set('x-user-id', session.user.id)
    response.headers.set('x-user-role', session.user.user_metadata.role || '')

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/author/:path*',
    '/dashboard/reviewer/:path*',
    '/admin/:path*'
  ]
}