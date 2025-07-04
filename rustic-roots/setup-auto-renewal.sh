#!/bin/bash

echo "⏰ Setting up automatic SSL certificate renewal"
echo ""

# Get current directory
SCRIPT_DIR=$(pwd)

# Create renewal script in /etc/cron.d/
echo "📝 Creating cron job..."

# Create the cron job
sudo tee /etc/cron.d/rusticroots-ssl-renewal > /dev/null << EOF
# Rustic Roots SSL Certificate Auto-Renewal
# Runs every day at 3:00 AM and 3:00 PM
0 3,15 * * * root cd $SCRIPT_DIR && ./renew-ssl.sh >> /var/log/rusticroots-ssl-renewal.log 2>&1
EOF

# Set proper permissions
sudo chmod 644 /etc/cron.d/rusticroots-ssl-renewal

# Restart cron service
sudo systemctl reload cron

echo "✅ Auto-renewal cron job created"
echo ""
echo "📋 Configuration:"
echo "   📅 Schedule: Daily at 3:00 AM and 3:00 PM"
echo "   📝 Log file: /var/log/rusticroots-ssl-renewal.log"
echo "   📁 Working directory: $SCRIPT_DIR"
echo ""
echo "🔍 To check cron job status:"
echo "   sudo crontab -l"
echo "   tail -f /var/log/rusticroots-ssl-renewal.log"
echo ""
echo "💡 Let's Encrypt certificates expire every 90 days"
echo "🔄 Auto-renewal will attempt renewal when certificates are within 30 days of expiry"