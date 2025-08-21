import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import prisma from '../../../lib/prisma'
import { sendWelcomeEmail } from '../../../lib/emailService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  try {
    console.log('Registration attempt for email:', email)
    
    // Test database connection
    console.log('Testing database connection...')
    await prisma.$connect()
    
    console.log('Checking for existing user...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return res.status(400).json({ error: 'User already exists' })
    }

    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('Creating user...')
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log('User created successfully:', user.id)
    
    // Send welcome email (don't wait for it to complete)
    sendWelcomeEmail(user).catch(error => {
      console.error('Failed to send welcome email:', error)
      // Don't fail registration if email fails
    })

    return res.status(201).json({ user })
  } catch (error) {
    console.error('Registration error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
      code: (error as { code?: string })?.code,
      meta: (error as { meta?: unknown })?.meta
    })
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}