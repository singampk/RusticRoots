#!/bin/bash

# Development SSL Setup using mkcert for locally-trusted certificates
# This creates certificates that browsers will trust on your local machine

set -e

DOMAIN="therusticroots.com.au"

echo "Setting up locally-trusted development SSL certificates for $DOMAIN"

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "Installing mkcert..."
    case "$(uname -s)" in
        Darwin*)
            if command -v brew &> /dev/null; then
                brew install mkcert
            else
                echo "Please install brew first, then run: brew install mkcert"
                exit 1
            fi
            ;;
        Linux*)
            echo "Please install mkcert manually:"
            echo "https://github.com/FiloSottile/mkcert#installation"
            exit 1
            ;;
        *)
            echo "Please install mkcert manually:"
            echo "https://github.com/FiloSottile/mkcert#installation"
            exit 1
            ;;
    esac
fi

echo "Installing local CA certificate in system trust store..."
mkcert -install

echo "Generating development SSL certificates..."

# Create certificates directory
mkdir -p certbot/conf/live/$DOMAIN

# Generate certificates using mkcert
cd certbot/conf/live/$DOMAIN
mkcert -key-file privkey.pem -cert-file fullchain.pem $DOMAIN www.$DOMAIN localhost 127.0.0.1 ::1

echo "Development certificates created!"

# Create Let's Encrypt style symlinks for compatibility
mkdir -p ../../archive/$DOMAIN
cp fullchain.pem ../../archive/$DOMAIN/fullchain1.pem
cp privkey.pem ../../archive/$DOMAIN/privkey1.pem
cp fullchain.pem ../../archive/$DOMAIN/cert1.pem
echo "" > ../../archive/$DOMAIN/chain1.pem

# Create symlinks
rm -f cert.pem chain.pem
ln -sf ../../archive/$DOMAIN/cert1.pem cert.pem
ln -sf ../../archive/$DOMAIN/chain1.pem chain.pem

echo "Let's Encrypt compatible structure created!"

# Return to project root
cd ../../../../

echo "Starting containers with SSL configuration..."

# Ensure SSL configuration is active
sed -i.bak 's|./nginx/ssl-init.conf|./nginx/ssl-proxy.conf|g' docker-compose.multi-container.yml

# Start containers
docker-compose -f docker-compose.multi-container.yml up -d

# Wait for containers to start
echo "Waiting for containers to start..."
sleep 15

echo "Testing HTTPS access..."

# Test HTTPS access (without -k flag since certificate should be trusted)
if curl -f https://$DOMAIN > /dev/null 2>&1; then
    echo "SUCCESS: HTTPS is working with locally-trusted certificate!"
    echo ""
    echo "Certificate details:"
    openssl x509 -in certbot/conf/live/$DOMAIN/fullchain.pem -text -noout | grep -A 3 "Issuer\|Subject\|DNS" | head -10
    echo ""
    echo "Your site is now accessible with trusted SSL:"
    echo "https://$DOMAIN"
    echo ""
    echo "✅ No browser warnings!"
    echo "✅ Green padlock in browser!"
    echo "✅ Trusted by your local machine!"
else
    echo "ERROR: HTTPS is not working"
    docker logs rusticroots-nginx --tail 10
    exit 1
fi

echo ""
echo "Development SSL setup complete!"
echo "This certificate is trusted by your local machine only."
echo "For production, you'll need real Let's Encrypt certificates with valid DNS."