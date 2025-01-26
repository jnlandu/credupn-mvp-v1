// utils/auth.ts
import { createBrowserClient } from '@supabase/ssr'
import Cookies from 'js-cookie'

interface AuthOptions {
  path: string
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  expires?: number
}

const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const saveAuthData = (token: string, role: string, rememberMe: boolean) => {
  const options: AuthOptions = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...(rememberMe ? { expires: 30 } : {})
  }
  
  Cookies.set('auth-token', token, options)
  Cookies.set('user-role', role, options)
}

export const clearAuthData = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  Cookies.remove('auth-token', { path: '/' })
  Cookies.remove('user-role', { path: '/' })
}

export const getAuthData = () => {
  return {
    token: Cookies.get('auth-token'),
    role: Cookies.get('user-role')
  }
}