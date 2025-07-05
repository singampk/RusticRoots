#!/bin/bash

# Multi-container SSL setup for therusticroots.com.au
# This creates 4 separate containers: database, app, nginx, certbot

set -e

DOMAIN=${1:-therusticroots.com.au}
EMAIL=${2:-admin@therusticroots.com.au}

echo "🚀 Setting up multi-container SSL deployment"
echo "============================================"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""
echo "📦 Architecture:"
echo "   1. PostgreSQL Database (with sample data)"
echo "   2. Next.js Application (Docker Hub image)"
echo "   3. Nginx SSL Proxy (HTTPS termination)"
echo "   4. Certbot (Certificate management)"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p certbot/conf
mkdir -p certbot/www
mkdir -p nginx/ssl

# Copy environment template
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cat > .env << EOF
# Database Configuration
POSTGRES_PASSWORD=RusticRoots2024!SecurePassword

# Application Configuration
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://$DOMAIN

# AWS Configuration (Optional)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
EOF
    echo "✅ Environment file created"
else
    echo "ℹ️  Using existing .env file"
fi

# Stop any existing containers
echo "🔄 Stopping existing containers..."
docker-compose -f docker-compose.multi-container.yml down 2>/dev/null || true
docker-compose -f docker-compose.working.yml down 2>/dev/null || true

# Step 1: Start database and app
echo "📊 Step 1: Starting database and application..."
docker-compose -f docker-compose.multi-container.yml up -d database app

# Wait for services to be ready
echo "⏳ Waiting for application to be ready..."
sleep 30

# Check if app is responding
echo "🔍 Testing application..."
APP_STATUS=""
for i in {1..10}; do
    if docker exec rusticroots-app curl -f http://localhost:3000/api/products >/dev/null 2>&1; then
        APP_STATUS="ready"
        break
    fi
    echo "⏳ Waiting for app... (attempt $i/10)"
    sleep 10
done

if [ "$APP_STATUS" != "ready" ]; then
    echo "❌ Application failed to start properly"
    echo "📊 Container status:"
    docker-compose -f docker-compose.multi-container.yml ps
    echo "📜 App logs:"
    docker logs rusticroots-app --tail=20
    exit 1
fi

echo "✅ Application is ready"

# Step 2: Set up nginx for HTTP (for Let's Encrypt challenge)
echo "📊 Step 2: Setting up nginx for certificate challenge..."

# Create temporary nginx config for HTTP only
cat > nginx/temp-http.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream app_backend {
        server app:3000;
    }

    server {
        listen 80;
        server_name therusticroots.com.au www.therusticroots.com.au;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
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

# Start nginx with HTTP-only config
docker run -d --name temp-nginx \
    --network rusticroots_frontend \
    -p 80:80 \
    -v $(pwd)/nginx/temp-http.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot/www:/var/www/certbot:ro \
    nginx:alpine

echo "✅ Temporary nginx started"

# Step 3: Obtain SSL certificate
echo "📊 Step 3: Obtaining SSL certificate..."
sleep 5

docker run --rm --name certbot \
    --network rusticroots_frontend \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot \
    certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Check if certificate was obtained
if [ -f "certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Stop temporary nginx
    docker stop temp-nginx
    docker rm temp-nginx
    rm nginx/temp-http.conf
    
    # Step 4: Start production nginx with SSL
    echo "📊 Step 4: Starting production nginx with SSL..."
    docker-compose -f docker-compose.multi-container.yml up -d nginx
    
    echo "⏳ Waiting for nginx to start..."
    sleep 10
    
    # Test HTTPS
    echo "🔍 Testing HTTPS connection..."
    if curl -f -k https://localhost >/dev/null 2>&1; then
        echo "✅ HTTPS is working!"
    else
        echo "⚠️  HTTPS may still be starting up"
    fi
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo "🔍 Please check:"
    echo "   - Domain DNS points to this server"
    echo "   - Port 80 is accessible from internet"
    echo "   - Domain is not behind CDN/proxy during setup"
    
    # Cleanup
    docker stop temp-nginx 2>/dev/null && docker rm temp-nginx 2>/dev/null
    exit 1
fi

# Step 5: Set up certificate renewal
echo "📊 Step 5: Setting up certificate auto-renewal..."
./setup-cert-renewal.sh

echo ""
echo "🎉 Multi-container SSL setup complete!"
echo "====================================="
echo ""
echo "📦 Running containers:"
echo "   🗄️  Database:  rusticroots-database"
echo "   🚀 App:       rusticroots-app"  
echo "   🔒 Nginx:     rusticroots-nginx"
echo "   📜 Certbot:   (runs periodically)"
echo ""
echo "🌐 Your site is now available at:"
echo "   🔒 https://$DOMAIN"
echo "   🔒 https://www.$DOMAIN"
echo ""
echo "🔧 Management commands:"
echo "   📊 Status:    docker-compose -f docker-compose.multi-container.yml ps"
echo "   📜 Logs:      docker-compose -f docker-compose.multi-container.yml logs -f"
echo "   🔄 Restart:   docker-compose -f docker-compose.multi-container.yml restart"
echo "   🛑 Stop:      docker-compose -f docker-compose.multi-container.yml down"
echo "   🔄 Renew SSL: ./renew-certificates.sh"
echo ""
echo "👤 Default login credentials:"
echo "   Admin: admin@therusticroots.com.au / password123"
echo "   User:  john@example.com / password123"