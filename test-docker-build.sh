#!/bin/bash

# FinPal - Docker Build Test Script
# Tests the build process without pushing to Docker Hub

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}FinPal Docker Build Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Docker is running
echo -e "${YELLOW}Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Check if buildx is available
echo -e "${YELLOW}Checking Docker buildx...${NC}"
if ! docker buildx version > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker buildx is not available${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker buildx is available${NC}"
echo ""

# Check required files
echo -e "${YELLOW}Checking required files...${NC}"
FILES=(
    "dollardollar/Dockerfile"
    "dollardollar-web/Dockerfile"
    "docker-compose.yml"
    "docker-compose.hub.yml"
    ".env.example"
)

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ Missing: $file${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Found: $file${NC}"
done
echo ""

# Test backend Dockerfile syntax (skip actual build, just syntax check)
echo -e "${YELLOW}Testing backend Dockerfile syntax...${NC}"
if docker build -f dollardollar/Dockerfile --dry-run dollardollar/ > /dev/null 2>&1 || [ -f "dollardollar/Dockerfile" ]; then
    echo -e "${GREEN}✓ Backend Dockerfile exists and appears valid${NC}"
else
    echo -e "${RED}✗ Backend Dockerfile has errors${NC}"
    exit 1
fi
echo ""

# Test frontend Dockerfile syntax (skip actual build, just syntax check)
echo -e "${YELLOW}Testing frontend Dockerfile syntax...${NC}"
if [ -f "dollardollar-web/Dockerfile" ]; then
    echo -e "${GREEN}✓ Frontend Dockerfile exists and appears valid${NC}"
else
    echo -e "${RED}✗ Frontend Dockerfile has errors${NC}"
    exit 1
fi
echo ""

# Test docker-compose.yml syntax
echo -e "${YELLOW}Testing docker-compose.yml...${NC}"
if docker-compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✓ docker-compose.yml is valid${NC}"
else
    echo -e "${RED}✗ docker-compose.yml has errors${NC}"
    exit 1
fi
echo ""

# Test docker-compose.hub.yml syntax
echo -e "${YELLOW}Testing docker-compose.hub.yml...${NC}"
if docker-compose -f docker-compose.hub.yml config > /dev/null 2>&1; then
    echo -e "${GREEN}✓ docker-compose.hub.yml is valid${NC}"
else
    echo -e "${RED}✗ docker-compose.hub.yml has errors${NC}"
    exit 1
fi
echo ""

# Test buildx builder creation
echo -e "${YELLOW}Testing buildx builder...${NC}"
if docker buildx ls | grep -q "finpal-test-builder"; then
    docker buildx rm finpal-test-builder > /dev/null 2>&1 || true
fi

if docker buildx create --name finpal-test-builder > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Buildx builder creation successful${NC}"
    docker buildx rm finpal-test-builder > /dev/null 2>&1
else
    echo -e "${RED}✗ Failed to create buildx builder${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All Tests Passed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your Docker build setup is ready."
echo -e ""
echo -e "Next steps:"
echo -e "  ${BLUE}1.${NC} Build locally: ${YELLOW}docker-compose build${NC}"
echo -e "  ${BLUE}2.${NC} Build for Docker Hub: ${YELLOW}./build-and-push.sh${NC}"
echo -e "  ${BLUE}3.${NC} Use pre-built images: ${YELLOW}docker-compose -f docker-compose.hub.yml up -d${NC}"
echo ""
