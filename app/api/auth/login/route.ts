// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
// import { validateAdmin } from '@/lib/admin'
import { validateCredentials } from '@/lib/auth'
import { sign } from 'jsonwebtoken'
import { generateToken } from '@/lib/auth'






export async function POST(req: Request) {

  // if (!process.env.JWT_SECRET) {
  //   throw new Error('JWT_SECRET must be defined in environment variables')
  // }
  // const JWT_SECRET = process.env.JWT_SECRET
  try {
    const { email, password }: any = await req.json()
    
    // const admin = await validateAdmin(email, password)
    const user = await validateCredentials(email, password)

    if (!user) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        )
      }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      role: user.role
    })

    // Set cookies in response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role
      }
    })

    // Set auth cookies with secure flags
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    response.cookies.set('user-role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24
    })

    return response

    // Remove password from response
    // const { password: _, ...userWithoutPassword } = user

    // // return NextResponse.json({ admin })
    // return NextResponse.json({
    //     user: userWithoutPassword,
    //     token
    //   })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 401}
    )
  }
}