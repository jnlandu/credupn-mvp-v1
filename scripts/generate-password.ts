// scripts/generate-password.ts
import * as bcrypt from 'bcryptjs'

async function generateHash() {
  const passwords = {
    admin: 'admin123',
    author: 'author123', 
    reviewer: 'reviewer123'
  }

  for (const [role, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10)
    console.log(`${role}: ${hash}`)
  }
}

generateHash()