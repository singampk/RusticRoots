import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verifyRole } from '../../../lib/authMiddleware'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' })
  }

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              name: true
            }
          }
        }
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      await verifyRole(req, 'ADMIN')
      const { name, description, price, category, stock, images, featured } = req.body

      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          category,
          stock,
          images,
          featured: Boolean(featured)
        }
      })

      return res.status(200).json({
        success: true,
        data: product
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
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' })
      }
      console.error('Error updating product:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await verifyRole(req, 'ADMIN')

      await prisma.product.delete({
        where: { id }
      })

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
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
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' })
      }
      console.error('Error deleting product:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}