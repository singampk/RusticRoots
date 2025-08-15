#!/bin/bash

# Automated Deployment Script for Rustic Roots
# This script builds, tags, pushes Docker image and deploys to AWS Lightsail

set -e

# Configuration
DOCKER_REPO="singampk/rusticroots"
DOMAIN="therusticroots.com.au"
SERVER_IP="13.238.116.88"
SERVER_USER="ubuntu"
SSH_KEY="$HOME/Downloads/LightsailDefaultKey-ap-southeast-2.pem"
APP_DIR="/apps/rustic_roots"
COMPOSE_FILE="docker-compose.prod-ssl.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if version parameter is provided
if [ -z "$1" ]; then
    log_error "Usage: $0 <version>"
    log_info "Example: $0 v1.6.3"
    exit 1
fi

VERSION=$1
FULL_IMAGE_TAG="$DOCKER_REPO:$VERSION"

log_info "Starting deployment for version: $VERSION"

# Step 1: Build and test locally
log_info "Step 1: Building and testing locally..."

# Run linting and type checking
log_info "Running ESLint..."
npm run lint

log_info "Building Next.js application (includes TypeScript checking)..."
npm run build

log_success "Local build and tests completed"

# Step 2: Build Docker image
log_info "Step 2: Building Docker image..."

docker build -t $FULL_IMAGE_TAG .

log_success "Docker image built: $FULL_IMAGE_TAG"

# Step 3: Test Docker image locally
log_info "Step 3: Testing Docker image locally..."

# Run container for health check
CONTAINER_ID=$(docker run -d -p 3001:3000 $FULL_IMAGE_TAG)
sleep 10

# Health check
if curl -f http://localhost:3001/api/healthz > /dev/null 2>&1; then
    log_success "Docker image health check passed"
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
else
    log_error "Docker image health check failed"
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
    exit 1
fi

# Step 4: Push to Docker Hub
log_info "Step 4: Pushing to Docker Hub..."

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    log_warning "Not logged in to Docker Hub. Please run: docker login"
    read -p "Press enter to continue after logging in..."
fi

docker push $FULL_IMAGE_TAG

log_success "Image pushed to Docker Hub: $FULL_IMAGE_TAG"

# Step 5: Update docker-compose.yml
log_info "Step 5: Updating docker-compose.yml..."

# Create backup of current compose file
cp $COMPOSE_FILE "${COMPOSE_FILE}.backup"

# Update image version in compose file
sed -i.bak "s|$DOCKER_REPO:v[0-9]\+\.[0-9]\+\.[0-9]\+|$FULL_IMAGE_TAG|g" $COMPOSE_FILE

log_success "Updated $COMPOSE_FILE with new image version"

# Step 6: Deploy to production server
log_info "Step 6: Deploying to production server..."

# Check SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    log_error "SSH key not found at: $SSH_KEY"
    exit 1
fi

# Set correct permissions for SSH key
chmod 600 "$SSH_KEY"

# Copy updated compose file to server
log_info "Copying updated compose file to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no $COMPOSE_FILE $SERVER_USER@$SERVER_IP:$APP_DIR/

# Deploy on server
log_info "Executing deployment commands on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << EOF
    set -e
    cd $APP_DIR
    
    echo "📥 Pulling new Docker image..."
    /usr/local/bin/docker-compose -f $COMPOSE_FILE pull app
    
    echo "🚀 Deploying new version..."
    /usr/local/bin/docker-compose -f $COMPOSE_FILE up -d app
    
    echo "⏳ Waiting for application to start..."
    sleep 15
    
    echo "🔍 Checking application health..."
    if docker logs rusticroots-app-prod --tail 5 | grep -q "Ready"; then
        echo "✅ Application started successfully"
    else
        echo "⚠️  Application may not have started properly. Check logs:"
        docker logs rusticroots-app-prod --tail 10
    fi
    
    echo "🧹 Cleaning up old Docker images..."
    docker system prune -f
    
    echo "📊 Current container status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
EOF

# Step 7: Verify deployment
log_info "Step 7: Verifying deployment..."

sleep 5

# Test health endpoint
if curl -f "https://$DOMAIN/api/healthz" > /dev/null 2>&1; then
    log_success "Production health check passed"
else
    log_warning "Production health check failed. Checking HTTP endpoint..."
    if curl -f "http://$SERVER_IP:3000/api/healthz" > /dev/null 2>&1; then
        log_warning "Application is running but HTTPS may have issues"
    else
        log_error "Application deployment may have failed"
        exit 1
    fi
fi

# Test main site
if curl -f "https://$DOMAIN" > /dev/null 2>&1; then
    log_success "Main site is accessible"
else
    log_warning "Main site may have issues"
fi

# Step 8: Cleanup and summary
log_info "Step 8: Cleanup and summary..."

# Restore original compose file from backup
mv "${COMPOSE_FILE}.backup" $COMPOSE_FILE

log_success "=== Deployment Summary ==="
log_success "Version: $VERSION"
log_success "Image: $FULL_IMAGE_TAG"
log_success "Deployed to: https://$DOMAIN"
log_success "Health check: https://$DOMAIN/api/healthz"

log_info "=== Next Steps ==="
log_info "1. Test the application: https://$DOMAIN"
log_info "2. Monitor logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'docker logs rusticroots-app-prod -f'"
log_info "3. Check SSL certificate: https://www.ssllabs.com/ssltest/"

# Optional: Open browser to test
read -p "Open browser to test deployment? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open "https://$DOMAIN"
fi

log_success "🎉 Deployment completed successfully!"