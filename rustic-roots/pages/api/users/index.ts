import { NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authenticate, AuthenticatedRequest, requireRole } from '../../../lib/authMiddleware'
import { Role } from '@prisma/client'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
        return res.status(200).json(users)
      
      case 'POST':
        // Validate role input
        if (req.body.role && !Object.values(Role).includes(req.body.role)) {
          return res.status(400).json({ error: 'Invalid role specified' })
        }
        
        // Ensure only ADMIN can create ADMIN users
        if (req.body.role === 'ADMIN' && req.user.role !== 'ADMIN') {
          return res.status(403).json({
            error: 'Forbidden: Only ADMIN users can create ADMIN accounts'
          })
        }
        
        const user = await prisma.user.create({
          data: {
            ...req.body,
            role: req.body.role || 'USER' // Default to USER if role not specified
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
        return res.status(201).json(user)
      
      case 'PATCH':
        if (!req.body.id) {
          return res.status(400).json({ error: 'User ID is required' })
        }
        
        // Prevent role escalation
        if (req.body.role === 'ADMIN' && req.user.role !== 'ADMIN') {
          return res.status(403).json({
            error: 'Forbidden: Only ADMIN users can promote to ADMIN'
          })
        }
        
        const updatedUser = await prisma.user.update({
          where: { id: req.body.id },
          data: req.body,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        })
        return res.status(200).json(updatedUser)
        
      case 'DELETE':
        if (!req.body.id) {
          return res.status(400).json({ error: 'User ID is required' })
        }
        
        // Prevent deleting own account
        if (req.body.id === req.user.id) {
          return res.status(403).json({
            error: 'Forbidden: Cannot delete your own account'
          })
        }
        
        await prisma.user.delete({ where: { id: req.body.id } })
        return res.status(204).end()
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default authenticate(requireRole('ADMIN')(handler))