#!/bin/bash

# SSL Certificate Renewal Script for Rustic Roots
# This script renews SSL certificates and reloads nginx

set -e

echo "Starting SSL certificate renewal..."

# Run certbot renewal
docker run --rm --name certbot-renew \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  --network rustic-roots_frontend \
  certbot/certbot renew \
  --webroot --webroot-path=/var/www/certbot \
  --quiet

# Reload nginx to pick up new certificates
echo "Reloading nginx configuration..."
docker-compose -f docker-compose.multi-container.yml exec nginx nginx -s reload

echo "SSL certificate renewal complete!"

# Show certificate status
echo "Current certificate status:"
docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt certbot/certbot certificates