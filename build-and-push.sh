#!/bin/bash

# FinPal - Docker Hub Build and Push Script
# Builds multi-architecture images and pushes to Docker Hub

set -e

# Configuration
DOCKER_HUB_REPO="${DOCKER_HUB_REPO:-finpal}"
VERSION="${VERSION:-latest}"
PLATFORMS="linux/amd64,linux/arm64"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}FinPal Docker Hub Build Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi

# Check if buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker buildx is not available${NC}"
    echo "Please install Docker Desktop or enable buildx"
    exit 1
fi

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}Warning: Not logged in to Docker Hub${NC}"
    echo "Please run: docker login"
    read -p "Press Enter to continue or Ctrl+C to abort..."
fi

# Create buildx builder if it doesn't exist
if ! docker buildx ls | grep -q "finpal-builder"; then
    echo -e "${YELLOW}Creating buildx builder: finpal-builder${NC}"
    docker buildx create --name finpal-builder --use
else
    echo -e "${GREEN}Using existing buildx builder: finpal-builder${NC}"
    docker buildx use finpal-builder
fi

# Bootstrap the builder
echo -e "${YELLOW}Bootstrapping builder...${NC}"
docker buildx inspect --bootstrap

# Build and push backend
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building Backend Image${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Repository: ${DOCKER_HUB_REPO}/backend"
echo "Version: ${VERSION}"
echo "Platforms: ${PLATFORMS}"
echo ""

docker buildx build \
    --platform ${PLATFORMS} \
    --tag ${DOCKER_HUB_REPO}/backend:${VERSION} \
    --tag ${DOCKER_HUB_REPO}/backend:latest \
    --file dollardollar/Dockerfile \
    --push \
    dollardollar/

echo -e "${GREEN}✓ Backend image built and pushed${NC}"

# Build and push frontend
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Building Frontend Image${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Repository: ${DOCKER_HUB_REPO}/web"
echo "Version: ${VERSION}"
echo "Platforms: ${PLATFORMS}"
echo ""

docker buildx build \
    --platform ${PLATFORMS} \
    --tag ${DOCKER_HUB_REPO}/web:${VERSION} \
    --tag ${DOCKER_HUB_REPO}/web:latest \
    --file dollardollar-web/Dockerfile \
    --push \
    dollardollar-web/

echo -e "${GREEN}✓ Frontend image built and pushed${NC}"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Build Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Images pushed to Docker Hub:"
echo "  - ${DOCKER_HUB_REPO}/backend:${VERSION}"
echo "  - ${DOCKER_HUB_REPO}/backend:latest"
echo "  - ${DOCKER_HUB_REPO}/web:${VERSION}"
echo "  - ${DOCKER_HUB_REPO}/web:latest"
echo ""
echo "To use these images, update your docker-compose.yml:"
echo "  backend: ${DOCKER_HUB_REPO}/backend:${VERSION}"
echo "  web: ${DOCKER_HUB_REPO}/web:${VERSION}"
echo ""
