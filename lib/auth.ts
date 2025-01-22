// lib/auth.ts
import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'



interface User {
  id: string
  name: string
  email: string
  password: string
  institution: string
  role: 'author' | 'reviewer' | 'admin'
}
interface TokenPayload extends JwtPayload {
  id: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables')
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}


export function generateToken(user: { id: string; role: string }) {

  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
}


export async function loginAdmin(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
  
    if (!response.ok) {
      throw new Error('Login failed')
    }
  
    const data  : any = await response.json()
    return data.admin
  }



  export async function validateCredentials(email: string, password: string): Promise<User | null> {
    const filePath = path.join(process.cwd(), 'data/users.csv')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    
    const users: User[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })
  
    const user = users.find(u => u.email === email)
    if (!user) return null
  
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null
  
    return user
  }