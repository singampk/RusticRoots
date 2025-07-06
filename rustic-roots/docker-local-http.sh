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
            echo ""
            echo "🌐 Application: http://localhost:3000"
            echo "🗄️  Database: localhost:5432"
            echo ""
            echo "👤 Test Accounts:"
            echo "   Admin: admin@therusticroots.com.au / password123"
            echo "   User:  john@example.com / password123"
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
    
    *)
        echo "Usage: $0 {start|stop|logs|restart}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the application"
        echo "  stop    - Stop all containers"
        echo "  logs    - Show container logs"
        echo "  restart - Restart containers"
        exit 1
        ;;
esac