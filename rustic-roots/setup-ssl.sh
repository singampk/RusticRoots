#!/bin/bash

echo "🔒 Setting up HTTPS for therusticroots.com.au"
echo ""

# Check if domain is provided
DOMAIN=${1:-therusticroots.com.au}
EMAIL=${2:-admin@therusticroots.com.au}

echo "📋 Configuration:"
echo "   Domain: $DOMAIN"
echo "   Email: $EMAIL"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p certbot/conf
mkdir -p certbot/www
mkdir -p nginx

# Check if nginx config exists
if [ ! -f "nginx/nginx.conf" ]; then
    echo "❌ nginx/nginx.conf not found. Please ensure it exists."
    exit 1
fi

# Step 1: Start nginx for HTTP challenge
echo "🌐 Starting nginx for Let's Encrypt challenge..."
docker-compose -f docker-compose.ssl.yml up -d database app

# Wait for app to be ready
echo "⏳ Waiting for application to be ready..."
sleep 15

# Start nginx without SSL first
echo "🔧 Starting nginx for HTTP-only mode..."
# Create temporary nginx config for initial setup
cat > nginx/nginx-temp.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name therusticroots.com.au www.therusticroots.com.au;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            proxy_pass http://app:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Start nginx with temporary config
docker run -d --name temp-nginx \
    --network rusticroots_rusticroots-network \
    -p 80:80 \
    -v $(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot/www:/var/www/certbot:ro \
    nginx:alpine

echo "🔐 Obtaining SSL certificate..."
sleep 5

# Get SSL certificate
docker run --rm --name certbot \
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
    rm nginx/nginx-temp.conf
    
    # Start full SSL setup
    echo "🚀 Starting full HTTPS setup..."
    docker-compose -f docker-compose.ssl.yml up -d
    
    echo ""
    echo "🎉 HTTPS setup complete!"
    echo ""
    echo "📍 Your site is now available at:"
    echo "   🌐 https://$DOMAIN"
    echo "   🌐 https://www.$DOMAIN"
    echo ""
    echo "🔒 SSL certificate expires in 90 days"
    echo "💡 Set up auto-renewal with: ./renew-ssl.sh"
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo "🔍 Please check:"
    echo "   - Domain DNS points to this server"
    echo "   - Port 80 is accessible from internet"
    echo "   - Domain is not behind CDN/proxy during setup"
    
    # Cleanup
    docker stop temp-nginx 2>/dev/null
    docker rm temp-nginx 2>/dev/null
    exit 1
fi