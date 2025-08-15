#!/bin/bash

# Deploy Only Script - Deploy existing Docker image to production
# Use this when the image is already built and pushed

set -e

# Configuration
DOCKER_REPO="singampk/rusticroots"
SERVER_IP="13.238.116.88"
SERVER_USER="ubuntu"
SSH_KEY="$HOME/Downloads/LightsailDefaultKey-ap-southeast-2.pem"
APP_DIR="/apps/rustic_roots"
COMPOSE_FILE="docker-compose.prod-ssl.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

if [ -z "$1" ]; then
    log_error "Usage: $0 <version>"
    log_info "Example: $0 v1.6.4"
    exit 1
fi

VERSION=$1
FULL_IMAGE_TAG="$DOCKER_REPO:$VERSION"

log_info "🚀 DEPLOY ONLY MODE - Using existing image"
log_info "Version: $VERSION"
log_info "Image: $FULL_IMAGE_TAG"

# Check SSH key exists and set permissions
if [ ! -f "$SSH_KEY" ]; then
    log_error "SSH key not found at: $SSH_KEY"
    exit 1
fi
chmod 600 "$SSH_KEY"

# Deploy to production
log_info "Deploying to production..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << EOF
    set -e
    cd $APP_DIR
    
    echo "📝 Updating docker-compose.yml..."
    sed -i 's|$DOCKER_REPO:v[0-9]\+\.[0-9]\+\.[0-9]\+|$FULL_IMAGE_TAG|g' $COMPOSE_FILE
    
    echo "📥 Pulling image: $FULL_IMAGE_TAG"
    /usr/local/bin/docker-compose -f $COMPOSE_FILE pull app
    
    echo "🚀 Deploying new version..."
    /usr/local/bin/docker-compose -f $COMPOSE_FILE up -d app
    
    echo "⏳ Waiting for application to start..."
    sleep 15
    
    echo "📊 Container status:"
    docker ps --filter "name=rusticroots-app-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo "📋 Recent logs:"
    docker logs rusticroots-app-prod --tail 10
    
    echo "🔍 Health check:"
    if curl -f http://localhost:3000/api/healthz > /dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "⚠️  Health check failed"
    fi
EOF

if [ $? -eq 0 ]; then
    log_success "🎉 Deployment completed successfully!"
    log_info "Test the application: https://therusticroots.com.au"
    log_info "Health check: https://therusticroots.com.au/api/healthz"
else
    log_error "Deployment failed"
    exit 1
fi