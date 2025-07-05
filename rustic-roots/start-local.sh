#!/bin/bash

echo "🚀 Starting Rustic Roots Local Development"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if ! brew services list | grep postgresql@15 | grep started > /dev/null; then
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    brew services start postgresql@15
else
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
fi

# Export PATH for PostgreSQL
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"

# Check database connection
echo -e "${BLUE}Testing database connection...${NC}"
if psql -d rustic_roots -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}Creating database...${NC}"
    createdb rustic_roots
fi

# Generate Prisma client
echo -e "${BLUE}Generating Prisma client...${NC}"
npx prisma generate

# Check if we need to push schema
echo -e "${BLUE}Checking database schema...${NC}"
if npx prisma db push --dry-run 2>&1 | grep -q "no changes"; then
    echo -e "${GREEN}✅ Database schema is up to date${NC}"
else
    echo -e "${YELLOW}Updating database schema...${NC}"
    npx prisma db push
fi

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "\n${BLUE}Starting development server...${NC}"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev