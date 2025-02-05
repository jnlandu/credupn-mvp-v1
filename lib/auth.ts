// utils/auth.ts
import jwt from 'jsonwebtoken'
import { createClient } from '@/utils/supabase/client'
import bcrypt from 'bcryptjs'

interface Credentials {
  email: string
  password: string
}

interface TokenPayload {
  userId: string
  email: string
  role: string
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables')
}

export async function validateCredentials(credentials: Credentials) {
  const supabase = createClient()

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single()

    if (error || !user) {
      return null
    }

    const isValid = await bcrypt.compare(credentials.password, user.password)

    if (!isValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error) {
    console.error('Error validating credentials:', error)
    return null
  }
}

export function generateToken(payload: TokenPayload) {
  try {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    )
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Could not generate authentication token')
  }
}

// Verify token utility
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}