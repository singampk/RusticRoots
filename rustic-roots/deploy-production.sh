#!/bin/bash

echo "🚀 Deploying Rustic Roots from Docker Hub..."
echo "📦 Image: singampk/rusticroots:latest"
echo ""

# Stop any existing containers
echo "🔄 Stopping existing containers..."
docker-compose -f docker-compose.working.yml down 2>/dev/null || true
docker-compose -f docker-compose.production.yml down 2>/dev/null || true

# Pull latest image
echo "📥 Pulling latest image from Docker Hub..."
docker pull singampk/rusticroots:latest

# Start production deployment
echo "🐳 Starting production containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check container status
echo "📊 Container Status:"
docker-compose -f docker-compose.production.yml ps

# Test database connectivity
echo ""
echo "🔍 Testing database connection..."
if docker exec rusticroots-db pg_isready -U rustic_admin -d rustic_roots; then
    echo "✅ Database is ready"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check database tables and data
echo ""
echo "📋 Checking database contents..."
echo "Tables in database:"
docker exec rusticroots-db psql -U rustic_admin -d rustic_roots -c "\dt" 2>/dev/null || echo "Tables not found - database may still be initializing"

echo ""
echo "Sample data check:"
docker exec rusticroots-db psql -U rustic_admin -d rustic_roots -c "SELECT COUNT(*) as products FROM \"Product\";" 2>/dev/null || echo "Product table not ready yet"

# Test application
echo ""
echo "🌐 Testing application..."
sleep 5
if curl -f http://localhost:3000/api/products >/dev/null 2>&1; then
    echo "✅ Application is responding"
else
    echo "⚠️  Application may still be starting up..."
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📍 Access points:"
echo "   🌐 Application: http://localhost:3000"
echo "   🗄️  Database: localhost:5432"
echo ""
echo "👤 Default login credentials:"
echo "   Admin: admin@therusticroots.com.au / password123"
echo "   User:  john@example.com / password123"
echo ""
echo "🛠️  Management commands:"
echo "   View logs: docker-compose -f docker-compose.production.yml logs -f"
echo "   Stop:      docker-compose -f docker-compose.production.yml down"
echo "   Restart:   docker-compose -f docker-compose.production.yml restart"