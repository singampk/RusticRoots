#!/bin/bash

# Quick Setup Script for Rustic Roots
# Sets up environment and database for local development

set -e

echo "🔧 Setting up Rustic Roots for local development..."

# Step 1: Environment file
if [ ! -f ".env.local" ]; then
    echo "📋 Creating environment file..."
    cp .env.example .env.local
    
    # Generate secure secret
    SECRET=$(openssl rand -base64 32)
    
    # Update .env.local with generated secret
    sed -i.bak "s/your-generated-32-character-secret/$SECRET/" .env.local
    rm .env.local.bak
    
    echo "✅ Created .env.local with secure secret"
    echo ""
    echo "⚠️  Update DATABASE_URL in .env.local if needed:"
    echo "   Current: postgresql://username:password@localhost:5432/rustic_roots"
    echo ""
else
    echo "✅ Environment file already exists"
fi

# Step 2: Check for PostgreSQL
echo "🗄️  Checking for PostgreSQL..."

# Try to connect to PostgreSQL
if command -v psql >/dev/null 2>&1 && psql -h localhost -U postgres -c '\q' >/dev/null 2>&1; then
    echo "✅ PostgreSQL is running"
    
    # Check if database exists
    if psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw rustic_roots; then
        echo "✅ Database 'rustic_roots' already exists"
    else
        echo "📊 Creating database 'rustic_roots'..."
        createdb -h localhost -U postgres rustic_roots
        echo "✅ Database created"
    fi
    
elif command -v brew >/dev/null 2>&1; then
    echo "📦 PostgreSQL not found. Installing with Homebrew..."
    brew install postgresql
    brew services start postgresql
    
    echo "📊 Creating database..."
    createdb rustic_roots
    echo "✅ PostgreSQL installed and database created"
    
else
    echo "❌ PostgreSQL not found and Homebrew not available"
    echo ""
    echo "🐳 Alternative: Use Docker for the database"
    echo "   Run: ./docker-local-http.sh start"
    echo "   Then update DATABASE_URL in .env.local to:"
    echo "   DATABASE_URL=\"postgresql://rustic_admin:RusticRoots2024!@localhost:5432/rustic_roots\""
    echo ""
    exit 1
fi

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Start development with:"
echo "   ./local-dev.sh"
echo ""
echo "🐳 Or use Docker instead:"
echo "   ./docker-local-http.sh start"