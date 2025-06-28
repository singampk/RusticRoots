import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import prisma from './prisma'

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string
    email: string
    name: string | null
    role: 'USER' | 'ADMIN'
  }
}

type AuthHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse> | void | NextApiResponse

export const requireRole = (role: 'USER' | 'ADMIN') => {
  return (handler: AuthHandler) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (req.user.role !== role) {
        return res.status(403).json({ error: 'Forbidden' })
      }
      return handler(req, res)
    }
  }
}

export const authenticate = (handler: AuthHandler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = await getToken({ req })
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Attach user to request
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        image: true,
        password: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    return handler(req, res)
  }
}

// Helper function for direct authentication check
export const verifyAuth = async (req: NextApiRequest) => {
  const token = await getToken({ req })
  if (!token) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

// Helper function for role verification
export const verifyRole = async (req: NextApiRequest, requiredRole: 'USER' | 'ADMIN') => {
  const user = await verifyAuth(req)
  
  if (user.role !== requiredRole) {
    throw new Error('Forbidden')
  }

  return user
}