import { NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { authenticate, AuthenticatedRequest } from '../../../lib/authMiddleware'
import { sendOrderConfirmationEmail } from '../../../lib/emailService'

export default authenticate(async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    console.log('Orders API called by user:', req.user.email, 'role:', req.user.role)
    
    switch (req.method) {
      case 'GET':
        // Allow admin to see all orders, regular users only see their own orders
        const whereClause = req.user.role === 'ADMIN' 
          ? {} 
          : { userId: req.user.id }
          
        console.log('Using where clause:', whereClause)
          
        const orders = await prisma.order.findMany({
          where: whereClause,
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
            },
            promotion: {
              select: {
                id: true,
                name: true,
                code: true,
                type: true,
                value: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        console.log('Found orders:', orders.length)
        return res.status(200).json(orders)
      
      case 'POST':
        const { items, ...orderData } = req.body
        const userId = req.user.id
        
        // Generate unique order number
        const orderNumber = `RR${Date.now()}`
        
        const order = await prisma.order.create({
          data: {
            ...orderData,
            orderNumber,
            user: { connect: { id: userId } },
            items: {
              create: items.map((item: { productId: string; quantity: number; price: number }) => ({
                product: { connect: { id: item.productId } },
                quantity: item.quantity,
                price: item.price
              }))
            }
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
        
        // Send order confirmation email (don't wait for it to complete)
        sendOrderConfirmationEmail(order).catch(error => {
          console.error('Failed to send order confirmation email:', error)
          // Don't fail order creation if email fails
        })
        
        return res.status(201).json(order)
      
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})