import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid promotion ID' });
    }

    if (req.method === 'GET') {
      // Get specific promotion
      const promotion = await prisma.promotion.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { usages: true, orders: true }
          }
        }
      });

      if (!promotion) {
        return res.status(404).json({ error: 'Promotion not found' });
      }

      // Non-admin users can only see active promotions
      if (session?.user?.role !== 'ADMIN') {
        if (!promotion.isActive || promotion.startDate > new Date() || promotion.endDate < new Date()) {
          return res.status(404).json({ error: 'Promotion not found' });
        }
      }

      return res.status(200).json(promotion);
    }

    if (req.method === 'PUT') {
      // Update promotion (admin only)
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
        isActive,
        startDate,
        endDate
      } = req.body;

      // Validate promotion type
      if (type && !['FIXED_AMOUNT', 'PERCENTAGE'].includes(type)) {
        return res.status(400).json({ error: 'Invalid promotion type' });
      }

      // Validate usage type
      if (usageType && !['ONE_TIME', 'MULTIPLE_USE'].includes(usageType)) {
        return res.status(400).json({ error: 'Invalid usage type' });
      }

      // Validate percentage value
      if (type === 'PERCENTAGE' && value && (value < 0 || value > 100)) {
        return res.status(400).json({ error: 'Percentage must be between 0 and 100' });
      }

      // Validate dates
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
          return res.status(400).json({ error: 'End date must be after start date' });
        }
      }

      try {
        const promotion = await prisma.promotion.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(code && { code: code.toUpperCase() }),
            ...(type && { type }),
            ...(value && { value: parseFloat(value) }),
            ...(usageType && { usageType }),
            ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
            ...(minOrderValue !== undefined && { minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null }),
            ...(maxDiscount !== undefined && { maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null }),
            ...(isActive !== undefined && { isActive }),
            ...(startDate && { startDate: new Date(startDate) }),
            ...(endDate && { endDate: new Date(endDate) })
          },
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { usages: true, orders: true }
            }
          }
        });

        return res.status(200).json(promotion);
      } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2002') {
          return res.status(400).json({ error: 'Promotion code already exists' });
        }
        if ((error as { code?: string }).code === 'P2025') {
          return res.status(404).json({ error: 'Promotion not found' });
        }
        throw error;
      }
    }

    if (req.method === 'DELETE') {
      // Delete promotion (admin only)
      if (!session || session.user.role !== 'ADMIN') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      try {
        await prisma.promotion.delete({
          where: { id }
        });

        return res.status(204).end();
      } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025') {
          return res.status(404).json({ error: 'Promotion not found' });
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