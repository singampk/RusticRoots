#!/bin/bash

# Local Development Server (HTTP on port 3000)
# For rapid development with hot reload
# Usage: ./local-dev.sh [start|stop]

set -e

# Function to stop development server
stop_dev_server() {
    echo "🛑 Stopping Rustic Roots development server..."
    
    # Kill Next.js dev server processes
    pkill -f "next dev" || true
    
    # Kill any node processes running on port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    echo "✅ Development server stopped"
    exit 0
}

# Parse command line arguments
COMMAND=${1:-start}

case "$COMMAND" in
    "stop")
        stop_dev_server
        ;;
    "start"|"")
        echo "🚀 Starting Rustic Roots in development mode..."
        ;;
    *)
        echo "❌ Unknown command: $COMMAND"
        echo "Usage: ./local-dev.sh [start|stop]"
        exit 1
        ;;
esac

# Check if environment file exists
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "❌ No environment file found!"
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Copy environment template:"
    echo "   cp .env.example .env.local"
    echo ""
    echo "2. Update .env.local with your database URL:"
    echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/rustic_roots\""
    echo ""
    echo "3. Generate a secure secret:"
    echo "   NEXTAUTH_SECRET=\"\$(openssl rand -base64 32)\""
    echo ""
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database is accessible
echo "🗄️  Checking database connection..."
if ! npx prisma db pull > /dev/null 2>&1; then
    echo "❌ Database not accessible!"
    echo ""
    echo "🛠️  Database Setup Options:"
    echo ""
    echo "Option 1: Install PostgreSQL locally"
    echo "  brew install postgresql"
    echo "  brew services start postgresql"
    echo "  createdb rustic_roots"
    echo ""
    echo "Option 2: Use Docker PostgreSQL"
    echo "  docker run --name rustic-postgres \\"
    echo "    -e POSTGRES_DB=rustic_roots \\"
    echo "    -e POSTGRES_USER=rustic_admin \\"
    echo "    -e POSTGRES_PASSWORD=password123 \\"
    echo "    -p 5432:5432 -d postgres:15"
    echo ""
    echo "Option 3: Use Docker Compose (recommended)"
    echo "  ./docker-local-http.sh start"
    echo ""
    echo "Then update your .env.local with the correct DATABASE_URL"
    exit 1
fi

# Run database migrations/seed if needed
echo "🗃️  Setting up database schema and seed data..."
npx prisma db push
npx prisma db seed

echo ""
echo "✅ Database ready! Starting development server..."
echo ""
echo "🌐 Application will be available at: http://localhost:3000"
echo ""
echo "👤 Test Accounts:"
echo "   Admin: admin@therusticroots.com.au / password123"
echo "   User:  john@example.com / password123"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start development server
echo "🚀 Starting Next.js development server..."
echo "   Use './local-dev.sh stop' to stop the server"
echo ""
npm run dev