import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@therusticroots.com.au',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  const customerUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'USER'
    }
  })

  console.log('✅ Created users')

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Rustic Oak Dining Table',
        description: 'Handcrafted solid oak dining table perfect for family gatherings. Features a beautiful live edge and can seat 6-8 people comfortably. Made from sustainably sourced American oak with a natural oil finish.',
        price: 1299.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],
        category: 'Tables',
        stock: 5,
        featured: true,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Walnut Bookshelf',
        description: 'Beautiful walnut bookshelf with adjustable shelves. Perfect for displaying books, decor, and personal items. Five adjustable shelves provide flexible storage options.',
        price: 899.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],
        category: 'Storage',
        stock: 3,
        featured: true,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Cedar Chest',
        description: 'Aromatic cedar chest for blanket and clothing storage. Features traditional dovetail joints and brass hardware. Natural cedar scent helps protect stored items.',
        price: 649.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],
        category: 'Storage',
        stock: 8,
        featured: true,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Maple Rocking Chair',
        description: 'Comfortable maple rocking chair with cushioned seat. Perfect for reading or relaxing. Hand-shaped curved back provides excellent support.',
        price: 499.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Chairs',
        stock: 12,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Pine Coffee Table',
        description: 'Rustic pine coffee table with lower shelf for storage. Great centerpiece for any living room. Distressed finish gives it a vintage farmhouse look.',
        price: 399.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Tables',
        stock: 7,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Oak Dining Chairs (Set of 4)',
        description: 'Set of four matching oak dining chairs with comfortable upholstered seats. Perfect complement to our dining tables. Seats are covered in durable linen fabric.',
        price: 799.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Chairs',
        stock: 6,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Cherry Wood Dresser',
        description: 'Elegant cherry wood dresser with six spacious drawers. Smooth-gliding drawers with soft-close mechanism. Perfect for bedroom storage.',
        price: 1099.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Storage',
        stock: 4,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Reclaimed Wood Console Table',
        description: 'Unique console table made from reclaimed barn wood. Each piece tells a story with its weathered character and natural patina.',
        price: 549.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Tables',
        stock: 9,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Mahogany Office Desk',
        description: 'Professional mahogany office desk with built-in drawers and cable management. Perfect for home office or study. Rich mahogany finish.',
        price: 1499.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Decor',
        stock: 2,
        ownerId: adminUser.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Teak Outdoor Bench',
        description: 'Weather-resistant teak outdoor bench. Naturally water-resistant and perfect for gardens, patios, or entryways. Ages beautifully to a silver-gray patina.',
        price: 349.99,
        images: ['https://files.therusticroots.com.au/images/placeholder-furniture.svg'],        category: 'Outdoor',
        stock: 15,
        ownerId: adminUser.id
      }
    })
  ])

  console.log('✅ Created products')

  // Create a sample order
  const sampleOrder = await prisma.order.create({
    data: {
      total: 1749.98,
      status: 'completed',
      userId: customerUser.id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price
          },
          {
            productId: products[3].id,
            quantity: 1,
            price: products[3].price
          }
        ]
      }
    },
    include: {
      items: true
    }
  })

  console.log('✅ Created sample order')

  console.log(`
🎉 Database seeded successfully!

👤 Admin User:
   Email: admin@therusticroots.com.au
   Password: password123

👤 Customer User:
   Email: john@example.com
   Password: password123

📦 Created ${products.length} products
📋 Created 1 sample order
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })