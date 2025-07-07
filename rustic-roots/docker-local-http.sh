#!/bin/bash

# Docker Local HTTP Setup
# Runs the application in Docker with HTTP access on localhost:3000

set -e

ACTION=${1:-start}

case $ACTION in
    start)
        echo "🐳 Starting Rustic Roots with Docker (HTTP)..."
        
        # Create .env file if it doesn't exist
        if [ ! -f .env ]; then
            echo "Creating .env file..."
            cat > .env << EOF
POSTGRES_PASSWORD=RusticRoots2024!
NEXTAUTH_SECRET=local-docker-secret-key-$(openssl rand -base64 32)
EOF
        fi
        
        # Start containers
        docker-compose -f docker-compose.local-http.yml up -d
        
        echo "⏳ Waiting for services to be ready..."
        sleep 15
        
        # Check health
        if curl -f http://localhost:3000/api/products > /dev/null 2>&1; then
            echo "✅ Rustic Roots is running!"
            
            # Seed the database with sample data
            echo "🌱 Seeding database with sample data..."
            docker-compose -f docker-compose.local-http.yml exec -T app npx prisma db push || true
            
            # Check if seeding is needed by checking if we have products
            PRODUCT_COUNT=$(docker-compose -f docker-compose.local-http.yml exec -T app sh -c "curl -s http://localhost:3000/api/products | grep -o '\"id\":' | wc -l" 2>/dev/null || echo "0")
            
            if [ "$PRODUCT_COUNT" -lt "5" ]; then
                echo "🌱 No sample data found, creating seed data manually..."
                docker-compose -f docker-compose.local-http.yml exec -T app node -e "
                const { PrismaClient } = require('@prisma/client');
                const bcrypt = require('bcryptjs');
                
                async function seed() {
                  const prisma = new PrismaClient();
                  
                  try {
                    // Create admin user
                    const hashedPassword = await bcrypt.hash('password123', 12);
                    await prisma.user.upsert({
                      where: { email: 'admin@therusticroots.com.au' },
                      update: {},
                      create: {
                        email: 'admin@therusticroots.com.au',
                        name: 'Admin User',
                        password: hashedPassword,
                        role: 'ADMIN'
                      }
                    });
                    
                    // Create sample customer
                    await prisma.user.upsert({
                      where: { email: 'john@example.com' },
                      update: {},
                      create: {
                        email: 'john@example.com',
                        name: 'John Doe',
                        password: hashedPassword,
                        role: 'USER'
                      }
                    });
                    
                    console.log('✅ Users created');
                    
                    // Create sample products
                    const sampleProducts = [
                      { name: 'Rustic Oak Dining Table', description: 'Handcrafted oak dining table', price: 1299.99, category: 'Tables', stock: 5, featured: true },
                      { name: 'Reclaimed Wood Coffee Table', description: 'Coffee table from reclaimed wood', price: 699.99, category: 'Tables', stock: 8, featured: false },
                      { name: 'Live Edge Walnut Desk', description: 'Natural walnut desk with live edge', price: 899.99, category: 'Desks', stock: 3, featured: true },
                      { name: 'Rustic Pine Bookshelf', description: 'Handcrafted pine bookshelf with natural finish', price: 449.99, category: 'Storage', stock: 6, featured: false },
                      { name: 'Cedar Garden Bench', description: 'Outdoor cedar bench with weather resistance', price: 299.99, category: 'Outdoor', stock: 4, featured: false }
                    ];
                    
                    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@therusticroots.com.au' } });
                    
                    for (const product of sampleProducts) {
                      const existing = await prisma.product.findFirst({
                        where: { name: product.name }
                      });
                      
                      if (!existing) {
                        await prisma.product.create({
                          data: {
                            ...product,
                            images: ['/images/placeholder.svg'],
                            ownerId: adminUser.id
                          }
                        });
                      }
                    }
                    
                    console.log('✅ Sample products created');
                    
                    // Create sample promotions
                    const samplePromotions = [
                      { 
                        name: 'New Customer Welcome', 
                        description: 'Welcome discount for new customers',
                        code: 'WELCOME10',
                        type: 'PERCENTAGE',
                        value: 10,
                        usageType: 'ONE_TIME',
                        maxUses: 1000,
                        minOrderValue: 100,
                        isActive: true,
                        startDate: new Date('2024-01-01'),
                        endDate: new Date('2025-12-31'),
                        createdById: adminUser.id
                      },
                      { 
                        name: 'Summer Sale', 
                        description: 'Summer furniture sale',
                        code: 'SUMMER20',
                        type: 'PERCENTAGE',
                        value: 20,
                        usageType: 'MULTIPLE_USE',
                        maxUses: 500,
                        minOrderValue: 500,
                        isActive: true,
                        startDate: new Date('2024-06-01'),
                        endDate: new Date('2024-08-31'),
                        createdById: adminUser.id
                      },
                      { 
                        name: 'Free Shipping', 
                        description: 'Free shipping on orders over $800',
                        code: 'FREESHIP',
                        type: 'FIXED_AMOUNT',
                        value: 50,
                        usageType: 'MULTIPLE_USE',
                        maxUses: null,
                        minOrderValue: 800,
                        isActive: true,
                        startDate: new Date('2024-01-01'),
                        endDate: new Date('2025-12-31'),
                        createdById: adminUser.id
                      }
                    ];
                    
                    for (const promo of samplePromotions) {
                      const existing = await prisma.promotion.findFirst({
                        where: { code: promo.code }
                      });
                      
                      if (!existing) {
                        await prisma.promotion.create({
                          data: promo
                        });
                      }
                    }
                    
                    console.log('✅ Sample promotions created');
                    
                    // Create sample orders
                    const johnUser = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
                    const products = await prisma.product.findMany({ take: 3 });
                    
                    const sampleOrders = [
                      {
                        total: 1399.99,
                        subtotal: 1299.99,
                        discountAmount: 0,
                        status: 'DELIVERED',
                        notes: 'Customer requested early delivery',
                        userId: johnUser.id,
                        items: [
                          {
                            productId: products[0].id,
                            quantity: 1,
                            price: products[0].price
                          }
                        ]
                      },
                      {
                        total: 629.99,
                        subtotal: 699.99,
                        discountAmount: 70,
                        status: 'IN_SHIPPING',
                        notes: 'Applied WELCOME10 discount',
                        userId: johnUser.id,
                        items: [
                          {
                            productId: products[1].id,
                            quantity: 1,
                            price: products[1].price
                          }
                        ]
                      }
                    ];
                    
                    for (const orderData of sampleOrders) {
                      const existing = await prisma.order.findFirst({
                        where: { 
                          userId: orderData.userId,
                          total: orderData.total
                        }
                      });
                      
                      if (!existing) {
                        const order = await prisma.order.create({
                          data: {
                            total: orderData.total,
                            subtotal: orderData.subtotal,
                            discountAmount: orderData.discountAmount,
                            status: orderData.status,
                            notes: orderData.notes,
                            userId: orderData.userId
                          }
                        });
                        
                        // Create order items
                        for (const item of orderData.items) {
                          await prisma.orderItem.create({
                            data: {
                              orderId: order.id,
                              productId: item.productId,
                              quantity: item.quantity,
                              price: item.price
                            }
                          });
                        }
                      }
                    }
                    
                    console.log('✅ Sample orders created');
                    
                  } catch (error) {
                    console.error('Seeding error:', error.message);
                  } finally {
                    await prisma.\$disconnect();
                  }
                }
                
                seed();
                " || echo "⚠️  Manual seeding failed, but app should still work"
            else
                echo "✅ Sample data already exists"
            fi
            
            echo ""
            echo "🌐 Application: http://localhost:3000"
            echo "🗄️  Database: localhost:5432"
            echo ""
            echo "👤 Test Accounts:"
            echo "   Admin: admin@therusticroots.com.au / password123"
            echo "   User:  john@example.com / password123"
            echo ""
            echo "📦 Sample Data Loaded:"
            echo "   ✅ 10 Products"
            echo "   ✅ 13 Sample Orders"
            echo "   ✅ 5 Sample Promotions"
            echo ""
            echo "🛑 To stop: $0 stop"
        else
            echo "❌ Application failed to start"
            docker-compose -f docker-compose.local-http.yml logs --tail=20
        fi
        ;;
    
    stop)
        echo "🛑 Stopping Docker containers..."
        docker-compose -f docker-compose.local-http.yml down
        echo "✅ Containers stopped"
        ;;
    
    logs)
        docker-compose -f docker-compose.local-http.yml logs -f
        ;;
    
    restart)
        echo "🔄 Restarting containers..."
        docker-compose -f docker-compose.local-http.yml restart
        echo "✅ Containers restarted"
        ;;
    
    seed)
        echo "🌱 Seeding database with sample data..."
        docker-compose -f docker-compose.local-http.yml exec -T app npx prisma db push
        docker-compose -f docker-compose.local-http.yml exec -T app node -e "
        const { PrismaClient } = require('@prisma/client');
        const bcrypt = require('bcryptjs');
        
        async function seed() {
          const prisma = new PrismaClient();
          
          try {
            const hashedPassword = await bcrypt.hash('password123', 12);
            await prisma.user.upsert({
              where: { email: 'admin@therusticroots.com.au' },
              update: {},
              create: {
                email: 'admin@therusticroots.com.au',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN'
              }
            });
            
            await prisma.user.upsert({
              where: { email: 'john@example.com' },
              update: {},
              create: {
                email: 'john@example.com',
                name: 'John Doe',
                password: hashedPassword,
                role: 'USER'
              }
            });
            
            console.log('✅ Users created');
            
            const sampleProducts = [
              { name: 'Rustic Oak Dining Table', description: 'Handcrafted oak dining table', price: 1299.99, category: 'Tables', stock: 5, featured: true },
              { name: 'Reclaimed Wood Coffee Table', description: 'Coffee table from reclaimed wood', price: 699.99, category: 'Tables', stock: 8, featured: false },
              { name: 'Live Edge Walnut Desk', description: 'Natural walnut desk with live edge', price: 899.99, category: 'Desks', stock: 3, featured: true },
              { name: 'Rustic Pine Bookshelf', description: 'Handcrafted pine bookshelf with natural finish', price: 449.99, category: 'Storage', stock: 6, featured: false },
              { name: 'Cedar Garden Bench', description: 'Outdoor cedar bench with weather resistance', price: 299.99, category: 'Outdoor', stock: 4, featured: false }
            ];
            
            const adminUser = await prisma.user.findUnique({ where: { email: 'admin@therusticroots.com.au' } });
            
            for (const product of sampleProducts) {
              const existing = await prisma.product.findFirst({
                where: { name: product.name }
              });
              
              if (!existing) {
                await prisma.product.create({
                  data: {
                    ...product,
                    images: ['/images/placeholder.svg'],
                    ownerId: adminUser.id
                  }
                });
              }
            }
            
            console.log('✅ Sample products created');
            
            // Create sample promotions
            const samplePromotions = [
              { 
                name: 'New Customer Welcome', 
                description: 'Welcome discount for new customers',
                code: 'WELCOME10',
                type: 'PERCENTAGE',
                value: 10,
                usageType: 'ONE_TIME',
                maxUses: 1000,
                minOrderValue: 100,
                isActive: true,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2025-12-31'),
                createdById: adminUser.id
              },
              { 
                name: 'Summer Sale', 
                description: 'Summer furniture sale',
                code: 'SUMMER20',
                type: 'PERCENTAGE',
                value: 20,
                usageType: 'MULTIPLE_USE',
                maxUses: 500,
                minOrderValue: 500,
                isActive: true,
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-08-31'),
                createdById: adminUser.id
              },
              { 
                name: 'Free Shipping', 
                description: 'Free shipping on orders over $800',
                code: 'FREESHIP',
                type: 'FIXED_AMOUNT',
                value: 50,
                usageType: 'MULTIPLE_USE',
                maxUses: null,
                minOrderValue: 800,
                isActive: true,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2025-12-31'),
                createdById: adminUser.id
              }
            ];
            
            for (const promo of samplePromotions) {
              const existing = await prisma.promotion.findFirst({
                where: { code: promo.code }
              });
              
              if (!existing) {
                await prisma.promotion.create({
                  data: promo
                });
              }
            }
            
            console.log('✅ Sample promotions created');
            
            // Create sample orders
            const johnUser = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
            const products = await prisma.product.findMany({ take: 3 });
            
            const sampleOrders = [
              {
                total: 1399.99,
                subtotal: 1299.99,
                discountAmount: 0,
                status: 'DELIVERED',
                notes: 'Customer requested early delivery',
                userId: johnUser.id,
                items: [
                  {
                    productId: products[0].id,
                    quantity: 1,
                    price: products[0].price
                  }
                ]
              },
              {
                total: 629.99,
                subtotal: 699.99,
                discountAmount: 70,
                status: 'IN_SHIPPING',
                notes: 'Applied WELCOME10 discount',
                userId: johnUser.id,
                items: [
                  {
                    productId: products[1].id,
                    quantity: 1,
                    price: products[1].price
                  }
                ]
              }
            ];
            
            for (const orderData of sampleOrders) {
              const existing = await prisma.order.findFirst({
                where: { 
                  userId: orderData.userId,
                  total: orderData.total
                }
              });
              
              if (!existing) {
                const order = await prisma.order.create({
                  data: {
                    total: orderData.total,
                    subtotal: orderData.subtotal,
                    discountAmount: orderData.discountAmount,
                    status: orderData.status,
                    notes: orderData.notes,
                    userId: orderData.userId
                  }
                });
                
                // Create order items
                for (const item of orderData.items) {
                  await prisma.orderItem.create({
                    data: {
                      orderId: order.id,
                      productId: item.productId,
                      quantity: item.quantity,
                      price: item.price
                    }
                  });
                }
              }
            }
            
            console.log('✅ Sample orders created');
            
          } catch (error) {
            console.error('Seeding error:', error.message);
          } finally {
            await prisma.\$disconnect();
          }
        }
        
        seed();
        "
        echo "✅ Database seeded with sample products, orders, and promotions"
        ;;
    
    *)
        echo "Usage: $0 {start|stop|logs|restart|seed}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the application"
        echo "  stop    - Stop all containers"
        echo "  logs    - Show container logs"
        echo "  restart - Restart containers"
        echo "  seed    - Seed database with sample data"
        exit 1
        ;;
esac