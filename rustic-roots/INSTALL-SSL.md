# SSL Certificate Installation Guide

Since you want a certificate from an authorized CA that browsers will trust, you have three options:

## Option 1: Locally-Trusted Development Certificates (Recommended for Local Testing)

This creates certificates that your Mac will trust without browser warnings:

```bash
# Install the local CA (will prompt for admin password)
sudo mkcert -install

# Generate certificates
mkcert -key-file certbot/conf/live/therusticroots.com.au/privkey.pem \
       -cert-file certbot/conf/live/therusticroots.com.au/fullchain.pem \
       therusticroots.com.au www.therusticroots.com.au localhost 127.0.0.1 ::1

# Start containers with SSL
docker-compose -f docker-compose.multi-container.yml up -d

# Test (should work without -k flag)
curl https://therusticroots.com.au
```

**Result**: ✅ Green padlock in browser, no warnings, trusted certificate

## Option 2: Real Let's Encrypt Certificate (Production)

When you have real DNS pointing to your server:

```bash
# Ensure DNS A records point to your server:
# A    therusticroots.com.au     → YOUR_SERVER_IP  
# A    www.therusticroots.com.au → YOUR_SERVER_IP

# Run the SSL setup script
./scripts/setup-real-ssl.sh 0

# This will:
# 1. Start HTTP server for domain validation
# 2. Get real Let's Encrypt certificate
# 3. Configure SSL automatically
```

**Result**: ✅ Real certificate from Let's Encrypt CA, trusted by all browsers worldwide

## Option 3: Temporary Public Domain

Use ngrok to get a temporary public domain for testing:

```bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# Start local app
docker-compose -f docker-compose.local.yml up -d

# Create public tunnel
ngrok http 3000

# Use the provided domain (e.g., abc123.ngrok.io) to get real Let's Encrypt cert
```

---

## Current Status

Your containers are running with HTTP-only configuration. Choose one of the options above to set up SSL.

### Quick Start (Option 1 - Recommended)

Run these commands for locally-trusted certificates:

```bash
# Install mkcert CA (enter admin password when prompted)
sudo mkcert -install

# Generate certificates
mkdir -p certbot/conf/live/therusticroots.com.au
mkcert -key-file certbot/conf/live/therusticroots.com.au/privkey.pem \
       -cert-file certbot/conf/live/therusticroots.com.au/fullchain.pem \
       therusticroots.com.au www.therusticroots.com.au

# Switch to SSL configuration
sed -i.bak 's|./nginx/ssl-init.conf|./nginx/ssl-proxy.conf|g' docker-compose.multi-container.yml

# Restart with SSL
docker-compose -f docker-compose.multi-container.yml restart nginx

# Test
curl https://therusticroots.com.au
```

Then open https://therusticroots.com.au in your browser - you should see a green padlock with no warnings!