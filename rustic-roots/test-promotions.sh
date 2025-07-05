#!/bin/bash

echo "🧪 Testing Rustic Roots Promotion System"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test API endpoint
test_api() {
    local description="$1"
    local url="$2"
    local data="$3"
    local expected_status="$4"
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "URL: $url"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" "$url")
    fi
    
    # Split response body and status code
    body=$(echo "$response" | head -n -1)
    status=$(echo "$response" | tail -n 1)
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ SUCCESS (Status: $status)${NC}"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
    else
        echo -e "${RED}❌ FAILED (Expected: $expected_status, Got: $status)${NC}"
        echo "Response: $body"
    fi
}

# Wait for server to be ready
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 3

# Test 1: Valid promotion code
test_api "Valid promotion code (WELCOME10)" \
    "http://localhost:3000/api/promotions/validate" \
    '{"code": "WELCOME10", "orderTotal": 500}' \
    "200"

# Test 2: Invalid promotion code
test_api "Invalid promotion code" \
    "http://localhost:3000/api/promotions/validate" \
    '{"code": "INVALID123", "orderTotal": 500}' \
    "200"

# Test 3: Promotion with insufficient order total
test_api "Promotion with insufficient order total" \
    "http://localhost:3000/api/promotions/validate" \
    '{"code": "SUMMER50", "orderTotal": 100}' \
    "200"

# Test 4: Free shipping promotion
test_api "Free shipping promotion" \
    "http://localhost:3000/api/promotions/validate" \
    '{"code": "FREESHIP", "orderTotal": 50}' \
    "200"

# Test 5: Bulk order promotion
test_api "Bulk order promotion (15% off $1200)" \
    "http://localhost:3000/api/promotions/validate" \
    '{"code": "BULK15", "orderTotal": 1200}' \
    "200"

# Test 6: Inactive promotion
test_api "Inactive promotion (BLACKFRIDAY20)" \
    "http://localhost:3000/api/promotions/validate" \
    '{"code": "BLACKFRIDAY20", "orderTotal": 500}' \
    "200"

# Test 7: Get public promotions
test_api "Get public active promotions" \
    "http://localhost:3000/api/promotions" \
    "" \
    "200"

echo -e "\n${BLUE}🔍 Database Check${NC}"
echo "You can view the database at: http://localhost:5555 (Prisma Studio)"

echo -e "\n${BLUE}🌐 Application URLs${NC}"
echo "Main app: http://localhost:3000"
echo "Admin login: http://localhost:3000/auth/signin"
echo "  - Email: admin@therusticroots.com.au"
echo "  - Password: password123"
echo "Customer login: http://localhost:3000/auth/signin"
echo "  - Email: john@example.com"
echo "  - Password: password123"

echo -e "\n${GREEN}🎫 Available Promotion Codes to Test:${NC}"
echo "  WELCOME10   - 10% off first order (min $100, max $200 discount)"
echo "  SUMMER50    - $50 off orders over $500"
echo "  FREESHIP    - Free shipping ($25 off any order)"
echo "  BULK15      - 15% off orders over $1000 (max $500 discount)"
echo "  BLACKFRIDAY20 - INACTIVE (should fail)"

echo -e "\n${BLUE}📝 Manual Testing Instructions:${NC}"
echo "1. Go to http://localhost:3000/products"
echo "2. Add items to cart (total more than $100 for WELCOME10)"
echo "3. Go to cart and try promotion codes"
echo "4. Sign in as admin and go to /admin/promotions to manage codes"
echo ""
echo -e "${GREEN}✅ Fixed UI Issues:${NC}"
echo "  - Added Header component to promotions management page"
echo "  - Fixed text color contrast in promotion code inputs"
echo "  - All form inputs now have proper visibility"

echo -e "\n${YELLOW}Test completed! Server is running on http://localhost:3000${NC}"