#!/bin/bash

echo "🚀 Starting Rustic Roots Docker containers..."

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Copying environment template..."
    cp .env.docker .env
fi

# Start containers with fast configuration
echo "🐳 Starting containers..."
docker-compose -f docker-compose.fast.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.fast.yml ps

# Show logs
echo "📜 Container logs:"
docker-compose -f docker-compose.fast.yml logs --tail=20

echo ""
echo "✅ Setup complete!"
echo "🌐 Application: http://localhost:3000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "To stop: docker-compose -f docker-compose.fast.yml down"