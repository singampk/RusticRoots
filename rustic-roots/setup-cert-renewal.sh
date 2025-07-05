#!/bin/bash

# Certificate auto-renewal setup for multi-container deployment

echo "📜 Setting up certificate auto-renewal"
echo "====================================="

# Create renewal script
cat > renew-certificates.sh << 'EOF'
#!/bin/bash

echo "🔄 Renewing SSL certificates..."

# Run certbot renewal
docker run --rm --name certbot-renew \
    --network rusticroots_frontend \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot \
    renew --webroot --webroot-path=/var/www/certbot

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo "✅ Certificate renewal successful"
    
    # Reload nginx to use new certificates
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
EOF

chmod +x renew-certificates.sh

# Create health check script
cat > check-ssl-health.sh << 'EOF'
#!/bin/bash

DOMAIN="therusticroots.com.au"

echo "🔍 SSL Health Check for $DOMAIN"
echo "================================"

# Check certificate expiry
echo "📅 Certificate expiry:"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates

# Check SSL rating
echo ""
echo "🔒 SSL Configuration:"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -subject -issuer

# Test HTTPS connectivity
echo ""
echo "🌐 Connectivity test:"
if curl -I https://$DOMAIN >/dev/null 2>&1; then
    echo "✅ HTTPS is working"
else
    echo "❌ HTTPS connection failed"
fi

# Check nginx status
echo ""
echo "📊 Nginx status:"
docker exec rusticroots-nginx nginx -t && echo "✅ Nginx config is valid" || echo "❌ Nginx config has errors"
EOF

chmod +x check-ssl-health.sh

# Create cron job for automatic renewal
SCRIPT_DIR=$(pwd)

echo "⏰ Setting up automatic renewal cron job..."

# Create the cron job
sudo tee /etc/cron.d/rusticroots-ssl-renewal > /dev/null << EOF
# Rustic Roots SSL Certificate Auto-Renewal
# Runs daily at 2:00 AM and 2:00 PM
0 2,14 * * * root cd $SCRIPT_DIR && ./renew-certificates.sh >> /var/log/rusticroots-ssl-renewal.log 2>&1

# Weekly SSL health check (Sundays at 6:00 AM)
0 6 * * 0 root cd $SCRIPT_DIR && ./check-ssl-health.sh >> /var/log/rusticroots-ssl-health.log 2>&1
EOF

# Set proper permissions
sudo chmod 644 /etc/cron.d/rusticroots-ssl-renewal

# Restart cron service
sudo systemctl reload cron

echo "✅ Certificate auto-renewal configured"
echo ""
echo "📋 Auto-renewal setup:"
echo "   ⏰ Schedule: Daily at 2:00 AM and 2:00 PM"
echo "   📁 Working directory: $SCRIPT_DIR"
echo "   📜 Renewal log: /var/log/rusticroots-ssl-renewal.log"
echo "   🔍 Health check log: /var/log/rusticroots-ssl-health.log"
echo ""
echo "🔧 Manual commands:"
echo "   🔄 Renew now: ./renew-certificates.sh"
echo "   🔍 Health check: ./check-ssl-health.sh"
echo "   📜 View renewal log: tail -f /var/log/rusticroots-ssl-renewal.log"