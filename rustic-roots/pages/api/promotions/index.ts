import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (req.method === 'GET') {
      // Get all promotions (admin only for full list, public for active ones)
      if (session?.user?.role === 'ADMIN') {
        const promotions = await prisma.promotion.findMany({
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { usages: true, orders: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(promotions);
      } else {
        // Public can only see active promotions
        const activePromotions = await prisma.promotion.findMany({
          where: {
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
          },
          select: {
            id: true,
            name: true,
            description: true,
            code: true,
            type: true,
            value: true,
            minOrderValue: true,
            maxDiscount: true,
            endDate: true
          }
        });
        return res.status(200).json(activePromotions);
      }
    }

    if (req.method === 'POST') {
      // Create new promotion (admin only)
      if (!session || session.user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        name,
        description,
        code,
        type,
        value,
        usageType,
        maxUses,
        minOrderValue,
        maxDiscount,
        startDate,
        endDate
      } = req.body;

      // Validate required fields
      if (!name || !code || !type || !value || !usageType || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate promotion type
      if (!['FIXED_AMOUNT', 'PERCENTAGE'].includes(type)) {
        return res.status(400).json({ error: 'Invalid promotion type' });
      }

      // Validate usage type
      if (!['ONE_TIME', 'MULTIPLE_USE'].includes(usageType)) {
        return res.status(400).json({ error: 'Invalid usage type' });
      }

      // Validate percentage value
      if (type === 'PERCENTAGE' && (value < 0 || value > 100)) {
        return res.status(400).json({ error: 'Percentage must be between 0 and 100' });
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      try {
        const promotion = await prisma.promotion.create({
          data: {
            name,
            description,
            code: code.toUpperCase(),
            type,
            value: parseFloat(value),
            usageType,
            maxUses: maxUses ? parseInt(maxUses) : null,
            minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
            startDate: start,
            endDate: end,
            createdById: session.user.id
          },
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          }
        });

        return res.status(201).json(promotion);
      } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2002') {
          return res.status(400).json({ error: 'Promotion code already exists' });
        }
        throw error;
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Promotion API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}