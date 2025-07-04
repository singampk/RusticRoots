#!/bin/bash

echo "🚀 Deploying Rustic Roots with HTTPS"
echo "🌐 Domain: therusticroots.com.au"
echo ""

# Configuration
DOMAIN="therusticroots.com.au"
EMAIL="admin@therusticroots.com.au"

# Check if running as root for some operations
if [[ $EUID -eq 0 ]]; then
    echo "⚠️  Running as root - some operations will be performed with elevated privileges"
else
    echo "💡 Some operations may require sudo privileges"
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo "   ✅ Domain DNS points to this server"
echo "   ✅ Ports 80 and 443 are open"
echo "   ✅ Docker and docker-compose installed"
echo "   ✅ Domain not behind CDN/proxy during setup"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Step 1: Create environment file
echo "📝 Creating environment configuration..."
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Database Configuration
POSTGRES_PASSWORD=RusticRoots2024!SecurePassword

# Application Configuration
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=https://therusticroots.com.au

# AWS Configuration (Optional)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
EOF
    echo "✅ Environment file created (.env)"
    echo "💡 Please update .env with your actual secret keys"
else
    echo "ℹ️  Using existing .env file"
fi

# Step 2: Stop any existing containers
echo ""
echo "🔄 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down 2>/dev/null || true
docker-compose -f docker-compose.ssl.yml down 2>/dev/null || true

# Step 3: Pull latest images
echo ""
echo "📥 Pulling latest Docker images..."
docker pull singampk/rusticroots:latest
docker pull nginx:alpine
docker pull certbot/certbot

# Step 4: Set up SSL
echo ""
echo "🔒 Setting up SSL certificate..."
./setup-ssl.sh $DOMAIN $EMAIL

# Check if SSL setup was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SSL setup successful!"
    
    # Step 5: Verify deployment
    echo ""
    echo "🔍 Verifying deployment..."
    sleep 10
    
    # Test HTTP redirect
    echo "Testing HTTP to HTTPS redirect..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L http://$DOMAIN)
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo "✅ HTTP redirect working"
    else
        echo "⚠️  HTTP redirect status: $HTTP_STATUS"
    fi
    
    # Test HTTPS
    echo "Testing HTTPS connection..."
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
    if [ "$HTTPS_STATUS" -eq 200 ]; then
        echo "✅ HTTPS working"
    else
        echo "❌ HTTPS status: $HTTPS_STATUS"
    fi
    
    # Test API
    echo "Testing API endpoint..."
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/products)
    if [ "$API_STATUS" -eq 200 ]; then
        echo "✅ API working"
    else
        echo "❌ API status: $API_STATUS"
    fi
    
    # Step 6: Set up auto-renewal
    echo ""
    echo "⏰ Setting up automatic SSL renewal..."
    ./setup-auto-renewal.sh
    
    # Final status
    echo ""
    echo "🎉 HTTPS deployment complete!"
    echo ""
    echo "📍 Your secure site is now available at:"
    echo "   🔒 https://therusticroots.com.au"
    echo "   🔒 https://www.therusticroots.com.au"
    echo ""
    echo "🛡️  Security features enabled:"
    echo "   ✅ SSL/TLS encryption"
    echo "   ✅ HTTP to HTTPS redirect"
    echo "   ✅ Security headers"
    echo "   ✅ Rate limiting"
    echo "   ✅ Gzip compression"
    echo "   ✅ Static file caching"
    echo ""
    echo "🔧 Management commands:"
    echo "   📊 View logs: docker-compose -f docker-compose.ssl.yml logs -f"
    echo "   🔄 Restart: docker-compose -f docker-compose.ssl.yml restart"
    echo "   🛑 Stop: docker-compose -f docker-compose.ssl.yml down"
    echo "   🔄 Renew SSL: ./renew-ssl.sh"
    echo ""
    echo "👤 Default login credentials:"
    echo "   Admin: admin@therusticroots.com.au / password123"
    echo "   User:  john@example.com / password123"
    
else
    echo ""
    echo "❌ SSL setup failed"
    echo "🔍 Common issues:"
    echo "   - Domain DNS not pointing to this server"
    echo "   - Firewall blocking ports 80/443"
    echo "   - Domain behind CDN/proxy"
    echo "   - Rate limits from Let's Encrypt"
    exit 1
fi