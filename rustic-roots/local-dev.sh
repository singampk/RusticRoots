#!/bin/bash

# Local Development Server (HTTP on port 3000)
# For rapid development with hot reload

set -e

echo "🚀 Starting Rustic Roots in development mode..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if database is accessible
if ! npx prisma db pull > /dev/null 2>&1; then
    echo "⚠️  Database not accessible. Make sure PostgreSQL is running."
    echo "   Run: brew services start postgresql"
    echo "   Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres"
    exit 1
fi

# Run database migrations/seed if needed
echo "Setting up database..."
npx prisma db push
npx prisma db seed

echo "✅ Starting development server on http://localhost:3000"
echo "   Admin: admin@therusticroots.com.au / password123"
echo "   User:  john@example.com / password123"
echo ""

# Start development server
npm run dev