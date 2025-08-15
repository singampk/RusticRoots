#!/bin/bash

# Quick Deploy Script - Production hotfix deployment
# For urgent fixes that bypass full testing pipeline

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

log_warning "🚨 QUICK DEPLOY MODE - Bypassing tests"
log_info "Version: $VERSION"

# Quick build and push
log_info "Building Docker image..."
docker build -t $FULL_IMAGE_TAG .

log_info "Pushing to Docker Hub..."
docker push $FULL_IMAGE_TAG

# Deploy directly to production
log_info "Deploying to production..."

# Check SSH key exists and set permissions
if [ ! -f "$SSH_KEY" ]; then
    log_error "SSH key not found at: $SSH_KEY"
    exit 1
fi
chmod 600 "$SSH_KEY"

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << EOF
    cd $APP_DIR
    sed -i 's|$DOCKER_REPO:v[0-9]\+\.[0-9]\+\.[0-9]\+|$FULL_IMAGE_TAG|g' $COMPOSE_FILE
    /usr/local/bin/docker-compose -f $COMPOSE_FILE pull app
    /usr/local/bin/docker-compose -f $COMPOSE_FILE up -d app
    sleep 10
    docker logs rusticroots-app-prod --tail 10
EOF

log_success "🚀 Quick deployment completed!"
log_warning "Remember to update local docker-compose.yml manually"