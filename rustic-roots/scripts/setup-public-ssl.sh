#!/bin/bash

# Public SSL Setup using ngrok for real Let's Encrypt certificates
# This creates a temporary public domain that Let's Encrypt can validate

set -e

echo "Setting up public domain access for real Let's Encrypt certificates"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "Installing ngrok..."
    # Download and install ngrok
    case "$(uname -s)" in
        Darwin*)
            if command -v brew &> /dev/null; then
                brew install ngrok/ngrok/ngrok
            else
                echo "Please install ngrok manually from https://ngrok.com/download"
                echo "Or install brew first: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            ;;
        Linux*)
            curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
            echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
            sudo apt update && sudo apt install ngrok
            ;;
        *)
            echo "Please install ngrok manually from https://ngrok.com/download"
            exit 1
            ;;
    esac
fi

echo "Starting application on localhost..."

# Start the application locally first
docker-compose -f docker-compose.local.yml up -d

# Wait for app to be ready
echo "Waiting for application to start..."
sleep 15

# Test local access
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "ERROR: Application not accessible on localhost:3000"
    docker-compose -f docker-compose.local.yml logs
    exit 1
fi

echo "Application running on localhost:3000"

# Start ngrok in background
echo "Starting ngrok tunnel..."
ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 5

# Get the public domain from ngrok
PUBLIC_DOMAIN=$(curl -s localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -n1 | sed 's/https:\/\///')

if [ -z "$PUBLIC_DOMAIN" ]; then
    echo "ERROR: Could not get ngrok domain. Check ngrok.log"
    kill $NGROK_PID 2>/dev/null || true
    exit 1
fi

echo "Public domain available: $PUBLIC_DOMAIN"
echo "Testing public access..."

# Test public access
if ! curl -f "https://$PUBLIC_DOMAIN" > /dev/null 2>&1; then
    echo "ERROR: Public domain not accessible"
    kill $NGROK_PID 2>/dev/null || true
    exit 1
fi

echo "SUCCESS: Your application is now publicly accessible!"
echo "Domain: $PUBLIC_DOMAIN"
echo "URL: https://$PUBLIC_DOMAIN"

echo ""
echo "To get a real Let's Encrypt certificate for this domain:"
echo "1. Update your DNS to point your real domain to your server"
echo "2. Run: docker run --rm -v \$(pwd)/certbot/conf:/etc/letsencrypt -v \$(pwd)/certbot/www:/var/www/certbot certbot/certbot certonly --webroot --webroot-path=/var/www/certbot --email admin@yourdomain.com --agree-tos --no-eff-email -d $PUBLIC_DOMAIN"
echo ""

echo "Or for testing with this temporary domain:"
echo "Replace 'therusticroots.com.au' with '$PUBLIC_DOMAIN' in your nginx config and run the SSL setup"

# Keep ngrok running
echo "Press Ctrl+C to stop the tunnel"
trap "kill $NGROK_PID 2>/dev/null || true; docker-compose -f docker-compose.local.yml down" EXIT

# Show tunnel status
curl -s localhost:4040/api/tunnels | python3 -m json.tool 2>/dev/null || echo "Tunnel active on $PUBLIC_DOMAIN"

# Wait for user to stop
wait $NGROK_PID 2>/dev/null || true