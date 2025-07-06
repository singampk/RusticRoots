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
            echo ""
            echo "🌐 Application: https://$DOMAIN"
            echo "🔒 HTTP Redirect: http://$DOMAIN → https://$DOMAIN"
            echo ""
            echo "👤 Test Accounts:"
            echo "   Admin: admin@therusticroots.com.au / password123"
            echo "   User:  john@example.com / password123"
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
    
    *)
        echo "Usage: $0 {start|stop|logs|restart|install-ca}"
        echo ""
        echo "Commands:"
        echo "  start      - Start the application with HTTPS"
        echo "  stop       - Stop all containers"
        echo "  logs       - Show container logs"
        echo "  restart    - Restart containers"
        echo "  install-ca - Install mkcert CA to avoid browser warnings"
        exit 1
        ;;
esac