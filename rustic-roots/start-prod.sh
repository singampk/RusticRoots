#!/bin/bash
echo "🚀 Starting Rustic Roots in production mode..."
echo "📊 Environment check:"
echo "  DATABASE_URL: ${DATABASE_URL:-'Not set'}"
echo "  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-'Not set'}"
echo "  NEXTAUTH_URL: ${NEXTAUTH_URL:-'Not set'}"

echo ""
echo "🏗️  Building application..."
npm run build

echo ""
echo "🌟 Starting production server..."
npm start