import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ValidationResult {
  isValid: boolean;
  promotion?: {
    id: string;
    name: string;
    description: string;
    code: string;
    type: string;
    value: number;
    maxDiscount?: number | null;
    minOrderValue?: number | null;
  };
  error?: string;
  discountAmount?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ValidationResult>) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ isValid: false, error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ isValid: false, error: 'Unauthorized' });
    }

    const { code, orderTotal, userId } = req.body;

    if (!code || !orderTotal) {
      return res.status(400).json({ isValid: false, error: 'Missing required fields' });
    }

    const currentUserId = userId || session.user.id;

    // Find the promotion
    const promotion = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        usages: {
          where: { userId: currentUserId }
        }
      }
    });

    if (!promotion) {
      return res.status(200).json({ isValid: false, error: 'Invalid promotion code' });
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      return res.status(200).json({ isValid: false, error: 'Promotion is not active' });
    }

    // Check if promotion has started
    if (promotion.startDate > new Date()) {
      return res.status(200).json({ isValid: false, error: 'Promotion has not started yet' });
    }

    // Check if promotion has expired
    if (promotion.endDate < new Date()) {
      return res.status(200).json({ isValid: false, error: 'Promotion has expired' });
    }

    // Check minimum order value
    if (promotion.minOrderValue && orderTotal < promotion.minOrderValue) {
      return res.status(200).json({ 
        isValid: false, 
        error: `Minimum order value of $${promotion.minOrderValue} required` 
      });
    }

    // Check usage limits
    if (promotion.maxUses && promotion.currentUses >= promotion.maxUses) {
      return res.status(200).json({ isValid: false, error: 'Promotion usage limit reached' });
    }

    // Check per-user usage for ONE_TIME promotions
    if (promotion.usageType === 'ONE_TIME' && promotion.usages.length > 0) {
      return res.status(200).json({ isValid: false, error: 'You have already used this promotion' });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promotion.type === 'PERCENTAGE') {
      discountAmount = (orderTotal * promotion.value) / 100;
      // Apply maximum discount limit if specified
      if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
        discountAmount = promotion.maxDiscount;
      }
    } else {
      discountAmount = promotion.value;
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return res.status(200).json({
      isValid: true,
      promotion: {
        id: promotion.id,
        name: promotion.name,
        description: promotion.description || '',
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        maxDiscount: promotion.maxDiscount,
        minOrderValue: promotion.minOrderValue
      },
      discountAmount
    });

  } catch (error) {
    console.error('Promotion validation error:', error);
    return res.status(500).json({ isValid: false, error: 'Internal server error' });
  }
}