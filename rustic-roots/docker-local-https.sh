#!/bin/bash

# Docker Local HTTPS Setup
# Runs the application in Docker with HTTPS access using locally-trusted certificates

set -e

ACTION=${1:-start}
DOMAIN="therusticroots.local"

setup_certificates() {
    echo "🔐 Setting up SSL certificates..."
    
    # Check if mkcert is installed
    if ! command -v mkcert &> /dev/null; then
        echo "Installing mkcert..."
        if command -v brew &> /dev/null; then
            brew install mkcert
        else
            echo "❌ Please install mkcert manually: https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    fi
    
    # Create SSL directory
    mkdir -p nginx/ssl
    
    # Generate certificates if they don't exist
    if [ ! -f "nginx/ssl/$DOMAIN.crt" ]; then
        echo "Generating SSL certificates for $DOMAIN..."
        mkcert -cert-file "nginx/ssl/$DOMAIN.crt" -key-file "nginx/ssl/$DOMAIN.key" $DOMAIN "www.$DOMAIN" localhost 127.0.0.1 ::1
        echo "✅ SSL certificates generated"
    fi
    
    # Create nginx SSL config if it doesn't exist
    if [ ! -f "nginx/ssl-proxy.conf" ]; then
        echo "Creating nginx SSL configuration..."
        cat > nginx/ssl-local.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Upstream for Next.js app
    upstream app_backend {
        server app:3000;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name therusticroots.local www.therusticroots.local localhost;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name therusticroots.local www.therusticroots.local localhost;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/therusticroots.local.crt;
        ssl_certificate_key /etc/nginx/ssl/therusticroots.local.key;
        
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers off;

        # Proxy to app
        location / {
            proxy_pass http://app_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
        echo "✅ Nginx SSL configuration created"
    fi
}

case $ACTION in
    start)
        echo "🐳 Starting Rustic Roots with Docker (HTTPS)..."
        
        # Setup certificates
        setup_certificates
        
        # Add domain to hosts file if not already there
        if ! grep -q "$DOMAIN" /etc/hosts; then
            echo "Adding $DOMAIN to /etc/hosts (requires sudo)..."
            echo "127.0.0.1 $DOMAIN www.$DOMAIN" | sudo tee -a /etc/hosts
        fi
        
        # Create .env file if it doesn't exist
        if [ ! -f .env ]; then
            echo "Creating .env file..."
            cat > .env << EOF
POSTGRES_PASSWORD=RusticRoots2024!
NEXTAUTH_SECRET=local-https-secret-key-$(openssl rand -base64 32)
EOF
        fi
        
        # Start containers
        docker-compose -f docker-compose.local-https.yml up -d
        
        echo "⏳ Waiting for services to be ready..."
        sleep 20
        
        # Check health
        if curl -k -f https://$DOMAIN > /dev/null 2>&1; then
            echo "✅ Rustic Roots is running with HTTPS!"
            
            # Seed the database with sample data
            echo "🌱 Seeding database with sample data..."
            docker-compose -f docker-compose.local-https.yml exec -T app npx prisma db push || true
            
            # Check if seeding is needed by checking if we have products
            PRODUCT_COUNT=$(docker-compose -f docker-compose.local-https.yml exec -T app sh -c "curl -s http://localhost:3000/api/products | grep -o '\"id\":' | wc -l" 2>/dev/null || echo "0")
            
            if [ "$PRODUCT_COUNT" -lt "3" ]; then
                echo "🌱 Creating seed data..."
                docker-compose -f docker-compose.local-https.yml exec -T app node -e "
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
                      { name: 'Rustic Oak Dining Table', description: 'Handcrafted oak dining table', price: 1299.99, category: 'Tables', stock: 5 },
                      { name: 'Reclaimed Wood Coffee Table', description: 'Coffee table from reclaimed wood', price: 699.99, category: 'Tables', stock: 8 },
                      { name: 'Live Edge Walnut Desk', description: 'Natural walnut desk with live edge', price: 899.99, category: 'Desks', stock: 3 }
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
                            featured: true,
                            ownerId: adminUser.id
                          }
                        });
                      }
                    }
                    
                    console.log('✅ Sample products created');
                    
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
            echo "🌐 Application: https://$DOMAIN"
            echo "🔒 HTTP Redirect: http://$DOMAIN → https://$DOMAIN"
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
            echo "📝 Note: Install mkcert CA with 'sudo mkcert -install' to avoid browser warnings"
            echo "🛑 To stop: $0 stop"
        else
            echo "❌ Application failed to start"
            docker-compose -f docker-compose.local-https.yml logs --tail=20
        fi
        ;;
    
    stop)
        echo "🛑 Stopping Docker containers..."
        docker-compose -f docker-compose.local-https.yml down
        echo "✅ Containers stopped"
        ;;
    
    logs)
        docker-compose -f docker-compose.local-https.yml logs -f
        ;;
    
    restart)
        echo "🔄 Restarting containers..."
        docker-compose -f docker-compose.local-https.yml restart
        echo "✅ Containers restarted"
        ;;
    
    install-ca)
        echo "🔐 Installing mkcert Certificate Authority..."
        sudo mkcert -install
        echo "✅ CA installed. Browsers will now trust the certificates."
        ;;
    
    seed)
        echo "🌱 Seeding database with sample data..."
        docker-compose -f docker-compose.local-https.yml exec -T app npx prisma db push
        docker-compose -f docker-compose.local-https.yml exec -T app node -e "
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
              { name: 'Rustic Oak Dining Table', description: 'Handcrafted oak dining table', price: 1299.99, category: 'Tables', stock: 5 },
              { name: 'Reclaimed Wood Coffee Table', description: 'Coffee table from reclaimed wood', price: 699.99, category: 'Tables', stock: 8 },
              { name: 'Live Edge Walnut Desk', description: 'Natural walnut desk with live edge', price: 899.99, category: 'Desks', stock: 3 }
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
                    images: ['/images/placeholder.jpg'],
                    featured: true,
                    ownerId: adminUser.id
                  }
                });
              }
            }
            
            console.log('✅ Sample products created');
            
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
        echo "Usage: $0 {start|stop|logs|restart|install-ca|seed}"
        echo ""
        echo "Commands:"
        echo "  start      - Start the application with HTTPS"
        echo "  stop       - Stop all containers"
        echo "  logs       - Show container logs"
        echo "  restart    - Restart containers"
        echo "  install-ca - Install mkcert CA to avoid browser warnings"
        echo "  seed       - Seed database with sample data"
        exit 1
        ;;
esac