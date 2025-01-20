// lib/admin.ts
import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { hash, compare } from 'bcryptjs'

interface Admin {
  email: string
  password: string
  name: string
  role: 'admin'
}

// Read admins from CSV
export async function getAdmins(): Promise<Admin[]> {
  const filePath = path.join(process.cwd(), 'data/admins.csv')
  const fileContent = await fs.readFile(filePath, 'utf-8')
  
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })
}

// Validate admin credentials
export async function validateAdmin(email: string, password: string) {
  const admins = await getAdmins()
  const admin = admins.find(a => a.email === email)
  
  if (!admin) return null
  
  const isValid = await compare(password, admin.password)
  if (!isValid) return null
  
  return {
    email: admin.email,
    name: admin.name,
    role: admin.role
  }
}