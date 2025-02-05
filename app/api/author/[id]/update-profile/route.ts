// app/api/authors/[id]/update-profile/route.ts
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import bcrypt from 'bcryptjs'
import { use } from 'react'


const filePath = path.join(process.cwd(), 'data/users.csv')


interface PageProps {
  params: Promise<{ id: string }>
}
export async function POST(req: Request, { params }: PageProps) {
  const { id } = use(params)
  const { name, email, institution, currentPassword, newPassword, confirmPassword }: any = await req.json()

  try {
    // Read existing users
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const users = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })

    // Find user by ID
    const userIndex = users.findIndex((user: any) => user.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users[userIndex]

    // Validate current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Validate new password confirmation
    if (newPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 })
    }

    // Update user details
    user.name = name
    user.email = email
    user.institution = institution
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10)
    }

    // Write updated users back to CSV
    const updatedContent = stringify(users, {
      header: true,
      columns: ['id', 'name', 'email', 'password', 'institution', 'role']
    })
    await fs.writeFile(filePath, updatedContent, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}