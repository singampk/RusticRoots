import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true
      },
      include: {
        owner: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json(featuredProducts)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return res.status(500).json({ error: 'Failed to fetch featured products' })
  }
}