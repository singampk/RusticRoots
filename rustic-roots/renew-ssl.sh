#!/bin/bash

echo "🔄 Renewing SSL certificate for therusticroots.com.au"
echo ""

# Renew certificate
docker run --rm --name certbot \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot \
    renew --webroot --webroot-path=/var/www/certbot

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo "✅ Certificate renewal successful"
    
    # Reload nginx to use new certificate
    echo "🔄 Reloading nginx..."
    docker exec rusticroots-nginx nginx -s reload
    
    echo "🎉 SSL renewal complete!"
    
    # Show certificate info
    echo ""
    echo "📋 Certificate information:"
    docker run --rm \
        -v $(pwd)/certbot/conf:/etc/letsencrypt \
        certbot/certbot \
        certificates
else
    echo "❌ Certificate renewal failed"
    exit 1
fi