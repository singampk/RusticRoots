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

  // Create sample orders with different statuses
  const sampleOrders = await Promise.all([
    // Recent orders - RECEIVED_ORDER status
    prisma.order.create({
      data: {
        total: 1299.99,
        status: 'RECEIVED_ORDER',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        items: {
          create: [
            {
              productId: products[0].id, // Rustic Oak Dining Table
              quantity: 1,
              price: products[0].price
            }
          ]
        }
      },
      include: { items: true }
    }),
    prisma.order.create({
      data: {
        total: 649.99,
        status: 'RECEIVED_ORDER',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        items: {
          create: [
            {
              productId: products[2].id, // Cedar Chest
              quantity: 1,
              price: products[2].price
            }
          ]
        }
      },
      include: { items: true }
    }),

    // Orders being reviewed - REVIEWING_ORDER status
    prisma.order.create({
      data: {
        total: 1599.98,
        status: 'REVIEWING_ORDER',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // Updated 8 hours ago
        items: {
          create: [
            {
              productId: products[5].id, // Oak Dining Chairs (Set of 4)
              quantity: 1,
              price: products[5].price
            },
            {
              productId: products[5].id, // Extra set
              quantity: 1,
              price: products[5].price
            }
          ]
        }
      },
      include: { items: true }
    }),
    prisma.order.create({
      data: {
        total: 1499.99,
        status: 'REVIEWING_ORDER',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // Updated 12 hours ago
        items: {
          create: [
            {
              productId: products[8].id, // Mahogany Office Desk
              quantity: 1,
              price: products[8].price
            }
          ]
        }
      },
      include: { items: true }
    }),

    // Work in progress orders - WORK_IN_PROGRESS status
    prisma.order.create({
      data: {
        total: 899.99,
        status: 'WORK_IN_PROGRESS',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Updated 3 days ago
        items: {
          create: [
            {
              productId: products[1].id, // Walnut Bookshelf
              quantity: 1,
              price: products[1].price
            }
          ]
        }
      },
      include: { items: true }
    }),
    prisma.order.create({
      data: {
        total: 949.98,
        status: 'WORK_IN_PROGRESS',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Updated 5 days ago
        items: {
          create: [
            {
              productId: products[3].id, // Maple Rocking Chair
              quantity: 1,
              price: products[3].price
            },
            {
              productId: products[4].id, // Pine Coffee Table
              quantity: 1,
              price: products[4].price
            }
          ]
        }
      },
      include: { items: true }
    }),

    // Shipping orders - IN_SHIPPING status
    prisma.order.create({
      data: {
        total: 1649.98,
        status: 'IN_SHIPPING',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Updated 2 days ago
        items: {
          create: [
            {
              productId: products[6].id, // Cherry Wood Dresser
              quantity: 1,
              price: products[6].price
            },
            {
              productId: products[7].id, // Reclaimed Wood Console Table
              quantity: 1,
              price: products[7].price
            }
          ]
        }
      },
      include: { items: true }
    }),
    prisma.order.create({
      data: {
        total: 349.99,
        status: 'IN_SHIPPING',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Updated 1 day ago
        items: {
          create: [
            {
              productId: products[9].id, // Teak Outdoor Bench
              quantity: 1,
              price: products[9].price
            }
          ]
        }
      },
      include: { items: true }
    }),

    // Delivered orders - DELIVERED status
    prisma.order.create({
      data: {
        total: 1749.98,
        status: 'DELIVERED',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Updated 7 days ago
        items: {
          create: [
            {
              productId: products[0].id, // Rustic Oak Dining Table
              quantity: 1,
              price: products[0].price
            },
            {
              productId: products[3].id, // Maple Rocking Chair
              quantity: 1,
              price: products[3].price
            }
          ]
        }
      },
      include: { items: true }
    }),
    prisma.order.create({
      data: {
        total: 1099.99,
        status: 'DELIVERED',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Updated 14 days ago
        items: {
          create: [
            {
              productId: products[6].id, // Cherry Wood Dresser
              quantity: 1,
              price: products[6].price
            }
          ]
        }
      },
      include: { items: true }
    }),
    prisma.order.create({
      data: {
        total: 949.98,
        status: 'DELIVERED',
        userId: customerUser.id,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Updated 30 days ago
        items: {
          create: [
            {
              productId: products[1].id, // Walnut Bookshelf
              quantity: 1,
              price: products[1].price
            },
            {
              productId: products[9].id, // Teak Outdoor Bench
              quantity: 1,
              price: products[9].price
            }
          ]
        }
      },
      include: { items: true }
    })
  ])

  console.log('✅ Created sample orders')

  console.log(`
🎉 Database seeded successfully!

👤 Admin User:
   Email: admin@therusticroots.com.au
   Password: password123

👤 Customer User:
   Email: john@example.com
   Password: password123

📦 Created ${products.length} products
📋 Created ${sampleOrders.length} sample orders
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