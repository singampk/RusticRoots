import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { verifyRole } from '../../../lib/authMiddleware'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Public access for browsing products
        const products = await prisma.product.findMany({
          include: {
            owner: {
              select: {
                name: true
              }
            }
          }
        })
        return res.status(200).json(products)
      
      case 'POST':
        // Admin access required for creating products
        try {
          const user = await verifyRole(req, 'ADMIN')
          
          const { name, description, price, category, stock, images, featured } = req.body
          
          const product = await prisma.product.create({
            data: {
              name,
              description,
              price,
              category,
              stock,
              images,
              featured: Boolean(featured),
              ownerId: user.id
            }
          })
          
          return res.status(201).json({
            success: true,
            data: product
          })
        } catch (authError: unknown) {
          if (authError instanceof Error) {
            if (authError.message === 'Unauthorized') {
              return res.status(401).json({ error: 'Unauthorized' })
            }
            if (authError.message === 'Forbidden') {
              return res.status(403).json({ error: 'Forbidden' })
            }
          }
          throw authError
        }
      
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}