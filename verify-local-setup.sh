#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Verifying local setup..."
echo ""

# Check API env
echo "📄 API Configuration (.env):"
if [ -f "apps/api/.env" ]; then
    PORT=$(grep "^PORT=" apps/api/.env | cut -d'=' -f2)
    CORS=$(grep "^CORS_ORIGIN=" apps/api/.env | cut -d'=' -f2)
    echo "   ✓ PORT: $PORT"
    echo "   ✓ CORS_ORIGIN: $CORS"
else
    echo "   ${RED}✗ No .env file found${NC}"
fi
echo ""

# Check Dashboard env
echo "📄 Dashboard Configuration (.env.local):"
if [ -f "apps/dashboard/.env.local" ]; then
    API_URL=$(grep "^NEXT_PUBLIC_API_URL=" apps/dashboard/.env.local | cut -d'=' -f2)
    echo "   ✓ NEXT_PUBLIC_API_URL: $API_URL"
else
    echo "   ${RED}✗ No .env.local file found${NC}"
fi
echo ""

# Check if API is running
echo "🔌 Service Status:"
if curl -s http://localhost:8081/health > /dev/null 2>&1; then
    echo "   ${GREEN}✓ API is running on port 8081${NC}"
else
    echo "   ${RED}✗ API is not running${NC}"
fi

if curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo "   ${GREEN}✓ Dashboard is running on port 3002${NC}"
else
    echo "   ${YELLOW}⚠ Dashboard is not running on port 3002${NC}"
fi
echo ""

# Test CORS
echo "🌐 CORS Test:"
CORS_TEST=$(curl -s -H "Origin: http://localhost:3002" -I http://localhost:8081/api/auth/login 2>/dev/null | grep "Access-Control-Allow-Origin" | cut -d' ' -f2 | tr -d '\r')
if [ "$CORS_TEST" = "http://localhost:3002" ]; then
    echo "   ${GREEN}✓ CORS is properly configured${NC}"
else
    echo "   ${RED}✗ CORS issue detected${NC}"
fi
echo ""

echo "📝 Instructions:"
echo "1. Make sure to restart the dashboard after changing environment variables"
echo "2. Run: ${GREEN}./run-local.sh --skip-migrate${NC}"
echo "3. Or in separate terminals:"
echo "   - Terminal 1: ${GREEN}cd apps/api && npm run dev${NC}"
echo "   - Terminal 2: ${GREEN}cd apps/dashboard && npm run dev${NC}"
echo ""
echo "🌐 Access at:"
echo "   - Dashboard: ${GREEN}http://localhost:3002${NC}"
echo "   - API: ${GREEN}http://localhost:8081${NC}"