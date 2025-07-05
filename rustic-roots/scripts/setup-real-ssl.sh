#!/bin/bash

# Real SSL Certificate Setup for Rustic Roots
# This script sets up proper Let's Encrypt certificates

set -e

DOMAIN="therusticroots.com.au"
EMAIL="admin@therusticroots.com.au"
STAGING=${1:-1}  # Use staging by default for testing

echo "Setting up REAL Let's Encrypt SSL certificates for $DOMAIN"

# Check if we're using staging or production
if [ "$STAGING" = "1" ]; then
    STAGING_FLAG="--staging"
    echo "Using Let's Encrypt STAGING environment (valid CA structure, but test certificates)"
    echo "These certificates are signed by Let's Encrypt but marked as test certificates"
else
    STAGING_FLAG=""
    echo "Using Let's Encrypt PRODUCTION environment (requires real DNS)"
fi

# Create necessary directories
mkdir -p certbot/conf certbot/www

echo "Step 1: Starting containers with HTTP-only configuration for certificate validation..."

# Use HTTP-only configuration for certificate challenge
sed -i.bak 's|./nginx/ssl-proxy.conf|./nginx/ssl-init.conf|g' docker-compose.multi-container.yml

# Start containers
docker-compose -f docker-compose.multi-container.yml up -d

# Wait for containers to be healthy
echo "Waiting for containers to start..."
sleep 15

# Check if HTTP is accessible
echo "Step 2: Testing HTTP access..."
if ! curl -f http://$DOMAIN > /dev/null 2>&1; then
    echo "ERROR: Cannot access http://$DOMAIN"
    echo ""
    echo "For local testing, add this line to /etc/hosts:"
    echo "127.0.0.1 $DOMAIN www.$DOMAIN"
    echo ""
    echo "For production, ensure DNS A records point to your server:"
    echo "A    $DOMAIN     → YOUR_SERVER_IP"
    echo "A    www.$DOMAIN → YOUR_SERVER_IP"
    exit 1
fi

echo "HTTP access confirmed. Proceeding with certificate generation..."

# Create a test challenge file to verify webroot works
mkdir -p certbot/www/.well-known/acme-challenge
echo "test-$RANDOM" > certbot/www/.well-known/acme-challenge/test-challenge

if ! curl -f http://$DOMAIN/.well-known/acme-challenge/test-challenge > /dev/null 2>&1; then
    echo "ERROR: Challenge path not accessible"
    docker logs rusticroots-nginx --tail 10
    exit 1
fi

rm certbot/www/.well-known/acme-challenge/test-challenge

echo "Step 3: Obtaining SSL certificate from Let's Encrypt..."

# Get SSL certificate from Let's Encrypt
if [ "$STAGING" = "1" ]; then
    echo "Getting STAGING certificate (signed by Let's Encrypt Staging CA)..."
else
    echo "Getting PRODUCTION certificate (requires real DNS)..."
fi

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

if [ $? -ne 0 ]; then
    echo "Certificate generation failed!"
    if [ "$STAGING" = "0" ]; then
        echo "For production certificates, ensure:"
        echo "1. Domain has valid DNS A records pointing to this server"
        echo "2. Port 80 is accessible from the internet"
        echo "3. No rate limits are hit (5 certificates per week per domain)"
    fi
    exit 1
fi

echo "Step 4: Switching to SSL configuration..."

# Switch to SSL configuration
sed -i.bak 's|./nginx/ssl-init.conf|./nginx/ssl-proxy.conf|g' docker-compose.multi-container.yml

# Restart nginx with SSL
docker-compose -f docker-compose.multi-container.yml restart nginx

# Wait for nginx to restart
sleep 10

echo "Step 5: Testing HTTPS access..."

# Test HTTPS access
if [ "$STAGING" = "1" ]; then
    # For staging certificates, use -k flag since browsers won't trust them
    if curl -k -f https://$DOMAIN > /dev/null 2>&1; then
        echo "SUCCESS: HTTPS is working with Let's Encrypt STAGING certificate!"
    else
        echo "ERROR: HTTPS is not working"
        docker logs rusticroots-nginx --tail 10
        exit 1
    fi
else
    # For production certificates, don't use -k flag
    if curl -f https://$DOMAIN > /dev/null 2>&1; then
        echo "SUCCESS: HTTPS is working with Let's Encrypt PRODUCTION certificate!"
    else
        echo "ERROR: HTTPS is not working"
        docker logs rusticroots-nginx --tail 10
        exit 1
    fi
fi

echo ""
echo "Let's Encrypt SSL setup complete!"
echo ""
echo "Certificate details:"
docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt certbot/certbot certificates

echo ""
echo "Access your site:"
echo "HTTP:  http://$DOMAIN (redirects to HTTPS)"
echo "HTTPS: https://$DOMAIN"

if [ "$STAGING" = "1" ]; then
    echo ""
    echo "NOTE: This is a STAGING certificate from Let's Encrypt"
    echo "- Signed by 'Fake LE Intermediate X1' (Let's Encrypt test CA)"
    echo "- Browsers will show 'Not Secure' but certificate is properly structured"
    echo "- Perfect for testing SSL configuration"
    echo ""
    echo "To get a PRODUCTION certificate (when DNS is ready):"
    echo "$0 0"
else
    echo ""
    echo "PRODUCTION certificate installed!"
    echo "- Signed by Let's Encrypt Authority"
    echo "- Trusted by all browsers"
    echo "- Valid for 90 days, auto-renewable"
fi

echo ""
echo "Set up automatic renewal with:"
echo "echo '0 */12 * * * cd $(pwd) && ./scripts/renew-ssl.sh' | crontab -"