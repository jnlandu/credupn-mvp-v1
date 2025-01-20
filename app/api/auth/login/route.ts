// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { validateAdmin } from '@/lib/admin'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    const admin = await validateAdmin(email, password)
    if (!admin) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    return NextResponse.json({ admin })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}