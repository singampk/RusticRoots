import { NextApiRequest, NextApiResponse } from 'next'
import { OrderStatus } from '@prisma/client'
import prisma from '../../../../lib/prisma'
import { verifyRole } from '../../../../lib/authMiddleware'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const { status } = req.body

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid order ID' })
  }

  if (!status || !Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' })
  }

  try {
    // Verify admin role
    await verifyRole(req, 'ADMIN')

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status: status as OrderStatus,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    })

    return res.status(200).json({
      success: true,
      data: updatedOrder
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      if (error.message === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' })
      }
    }
    
    console.error('Error updating order status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}