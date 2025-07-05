#!/bin/bash

# Let's Encrypt setup script for Rustic Roots
# This script sets up SSL certificates using Let's Encrypt

set -e

DOMAIN="therusticroots.com.au"
EMAIL="admin@therusticroots.com.au"
STAGING=${1:-0}  # Use staging by default for testing

echo "Setting up Let's Encrypt SSL certificates for $DOMAIN"

# Create necessary directories
mkdir -p certbot/conf certbot/www

# Check if we're using staging or production
if [ "$STAGING" = "1" ]; then
    STAGING_FLAG="--staging"
    echo "Using Let's Encrypt STAGING environment (test certificates)"
else
    STAGING_FLAG=""
    echo "Using Let's Encrypt PRODUCTION environment (real certificates)"
fi

# Step 1: Start containers with HTTP-only configuration
echo "Step 1: Starting containers with HTTP-only configuration..."
docker-compose -f docker-compose.multi-container.yml down
cp nginx/ssl-init.conf nginx/active.conf
sed -i.bak 's|./nginx/ssl-proxy.conf|./nginx/active.conf|g' docker-compose.multi-container.yml
docker-compose -f docker-compose.multi-container.yml up -d

# Wait for containers to be healthy
echo "Waiting for containers to start..."
sleep 10

# Step 2: Test HTTP access
echo "Step 2: Testing HTTP access..."
if ! curl -f http://$DOMAIN > /dev/null 2>&1; then
    echo "ERROR: Cannot access http://$DOMAIN - check your /etc/hosts file"
    echo "Add this line to /etc/hosts: 127.0.0.1 $DOMAIN www.$DOMAIN"
    exit 1
fi

# Step 3: Get SSL certificate
echo "Step 3: Obtaining SSL certificate..."
docker run --rm --name certbot-get-cert \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  --network rustic-roots_frontend \
  certbot/certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos --no-eff-email \
  $STAGING_FLAG \
  --force-renewal \
  -d $DOMAIN -d www.$DOMAIN

# Step 4: Switch to SSL configuration
echo "Step 4: Switching to SSL configuration..."
cp nginx/ssl-proxy.conf nginx/active.conf
sed -i.bak 's|./nginx/ssl-proxy.conf|./nginx/active.conf|g' docker-compose.multi-container.yml
docker-compose -f docker-compose.multi-container.yml restart nginx

# Wait for nginx to restart
sleep 5

# Step 5: Test HTTPS access
echo "Step 5: Testing HTTPS access..."
if curl -k -f https://$DOMAIN > /dev/null 2>&1; then
    echo "SUCCESS: HTTPS is working!"
    echo "Certificate details:"
    docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt certbot/certbot certificates
else
    echo "ERROR: HTTPS is not working"
    docker logs rusticroots-nginx --tail 20
    exit 1
fi

echo "Let's Encrypt SSL setup complete!"
echo "HTTP: http://$DOMAIN (redirects to HTTPS)"
echo "HTTPS: https://$DOMAIN"

if [ "$STAGING" = "1" ]; then
    echo ""
    echo "NOTE: This is a STAGING certificate (not trusted by browsers)"
    echo "To get a production certificate, run: $0 0"
fi