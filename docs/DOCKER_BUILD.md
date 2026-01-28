# FinPal - Docker Build and Release Guide

This guide explains how to build and publish FinPal Docker images to Docker Hub.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Manual Build Process](#manual-build-process)
- [Using Pre-built Images](#using-pre-built-images)
- [Automated Builds](#automated-builds)
- [Version Tagging Strategy](#version-tagging-strategy)
- [Multi-Architecture Support](#multi-architecture-support)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### For Manual Builds

1. **Docker Desktop** (or Docker Engine with buildx)
   - Version 20.10+ recommended
   - BuildKit enabled (default in recent versions)

2. **Docker Hub Account**
   - Create account at https://hub.docker.com
   - Create access token: Account Settings → Security → New Access Token

3. **Login to Docker Hub**
   ```bash
   docker login
   # Enter username and access token (not password)
   ```

### For Automated Builds

1. **GitHub Repository Secrets**
   - `DOCKER_HUB_USERNAME` - Your Docker Hub username
   - `DOCKER_HUB_TOKEN` - Docker Hub access token

---

## Manual Build Process

### Quick Start

The easiest way to build and push images:

```bash
# Make script executable
chmod +x build-and-push.sh

# Build and push with default settings
./build-and-push.sh

# Build and push with custom version
VERSION=1.0.0 ./build-and-push.sh

# Build and push to custom repository
DOCKER_HUB_REPO=yourusername/finpal VERSION=1.0.0 ./build-and-push.sh
```

### What the Script Does

1. **Creates buildx builder** - Multi-architecture build support
2. **Builds backend image** - Python Flask API (linux/amd64, linux/arm64)
3. **Builds frontend image** - React web app (linux/amd64, linux/arm64)
4. **Tags images** - Both version-specific and `latest` tags
5. **Pushes to Docker Hub** - Makes images publicly available

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DOCKER_HUB_REPO` | `finpal` | Docker Hub repository name |
| `VERSION` | `latest` | Version tag for images |
| `PLATFORMS` | `linux/amd64,linux/arm64` | Target platforms |

### Step-by-Step Manual Build

If you prefer manual control:

```bash
# 1. Create and use buildx builder
docker buildx create --name finpal-builder --use
docker buildx inspect --bootstrap

# 2. Build backend
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag finpal/backend:1.0.0 \
  --tag finpal/backend:latest \
  --file dollardollar/Dockerfile \
  --push \
  dollardollar/

# 3. Build frontend
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag finpal/web:1.0.0 \
  --tag finpal/web:latest \
  --file dollardollar-web/Dockerfile \
  --push \
  dollardollar-web/
```

---

## Using Pre-built Images

### With docker-compose.hub.yml

The easiest way to use pre-built images:

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your settings
nano .env

# 3. Start FinPal with pre-built images
docker-compose -f docker-compose.hub.yml up -d

# 4. Use specific version
VERSION=1.0.0 docker-compose -f docker-compose.hub.yml up -d
```

### Direct Docker Run

```bash
# Backend
docker run -d \
  --name finpal-backend \
  -e DATABASE_URL=postgresql://user:pass@db:5432/finpal \
  -p 5000:5000 \
  finpal/backend:latest

# Frontend
docker run -d \
  --name finpal-web \
  -p 3000:80 \
  finpal/web:latest
```

### Pulling Specific Versions

```bash
# Pull latest
docker pull finpal/backend:latest
docker pull finpal/web:latest

# Pull specific version
docker pull finpal/backend:1.0.0
docker pull finpal/web:1.0.0

# Pull for specific architecture
docker pull --platform linux/arm64 finpal/backend:latest
```

---

## Automated Builds

### GitHub Actions Workflow

The repository includes a GitHub Actions workflow (`.github/workflows/docker-build.yml`) that automatically:

1. **Builds on every push to main** - Creates `latest` tag
2. **Builds on version tags** - Creates semantic version tags
3. **Builds on pull requests** - Validates builds without pushing
4. **Supports manual triggers** - Via GitHub UI

### Triggering a Build

#### Automatic on Push

```bash
git commit -m "Update feature"
git push origin main
# Triggers build with 'latest' tag
```

#### Version Release

```bash
git tag v1.0.0
git push origin v1.0.0
# Triggers build with tags: v1.0.0, 1.0, 1, latest
```

#### Manual Trigger

1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Build and Push Docker Images"
4. Click "Run workflow"
5. Choose branch and click "Run workflow"

### Setting Up Secrets

Required for automated builds:

1. Go to repository Settings → Secrets and variables → Actions
2. Add new repository secrets:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_TOKEN`: Docker Hub access token (not password)

---

## Version Tagging Strategy

FinPal follows semantic versioning (SemVer):

### Version Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., database schema changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Tag Examples

When you push tag `v1.2.3`, GitHub Actions creates:

- `finpal/backend:1.2.3` - Full version
- `finpal/backend:1.2` - Major.minor
- `finpal/backend:1` - Major only
- `finpal/backend:latest` - Always points to latest stable

### Recommended Usage

**Production:**
```yaml
services:
  backend:
    image: finpal/backend:1.2  # Pin to major.minor
```

**Development:**
```yaml
services:
  backend:
    image: finpal/backend:latest  # Always get latest
```

**Specific Version:**
```yaml
services:
  backend:
    image: finpal/backend:1.2.3  # Exact version
```

---

## Multi-Architecture Support

FinPal images support multiple CPU architectures:

### Supported Platforms

- **linux/amd64** - Intel/AMD 64-bit (most servers, desktops)
- **linux/arm64** - ARM 64-bit (Raspberry Pi 4+, Apple Silicon, AWS Graviton)

### Automatic Platform Detection

Docker automatically pulls the correct architecture:

```bash
# On Intel/AMD
docker pull finpal/backend:latest
# Pulls linux/amd64 image

# On Raspberry Pi 4 / Apple Silicon
docker pull finpal/backend:latest
# Pulls linux/arm64 image
```

### Force Specific Architecture

```bash
# Force ARM64 on Intel machine
docker pull --platform linux/arm64 finpal/backend:latest

# Force AMD64 on ARM machine
docker pull --platform linux/amd64 finpal/backend:latest
```

### Build for Specific Platform

```bash
# Build only for AMD64
docker buildx build \
  --platform linux/amd64 \
  --tag finpal/backend:latest \
  --file dollardollar/Dockerfile \
  dollardollar/
```

---

## Troubleshooting

### Build Fails with "no buildx builder"

**Solution:**
```bash
# Install buildx (if not included)
docker buildx install

# Create builder
docker buildx create --name finpal-builder --use
```

### Push Fails with "unauthorized"

**Solution:**
```bash
# Login again
docker logout
docker login

# Verify credentials
docker info | grep Username
```

### Multi-arch Build is Slow

**Cause:** Building for ARM on Intel (or vice versa) uses emulation

**Solutions:**
- Use GitHub Actions (cloud builders)
- Build only needed architecture locally
- Use native ARM machine for ARM builds

### Image Too Large

**Solutions:**
```bash
# Check image size
docker images finpal/backend

# Inspect layers
docker history finpal/backend:latest

# Use multi-stage builds (already implemented)
# Clean up build cache
docker builder prune
```

### Permission Denied on build-and-push.sh

**Solution:**
```bash
chmod +x build-and-push.sh
```

### GitHub Actions Build Fails

**Check:**
1. Secrets are set correctly
2. Docker Hub credentials are valid
3. Repository name matches in workflow
4. No rate limiting from Docker Hub

**View Logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Expand failed step
4. Check error messages

---

## Advanced Topics

### Custom Docker Hub Repository

If you're forking FinPal:

```bash
# Update repository name
export DOCKER_HUB_REPO=yourusername/yourapp

# Build and push
./build-and-push.sh

# Update docker-compose.hub.yml
sed -i 's/finpal/yourusername\/yourapp/g' docker-compose.hub.yml
```

### Private Docker Hub Repository

```bash
# Images are public by default
# To make private:
# 1. Go to Docker Hub
# 2. Select repository
# 3. Settings → Make Private

# Pull private images
docker login
docker pull yourusername/private-repo:latest
```

### Build with Build Arguments

```bash
docker buildx build \
  --build-arg PYTHON_VERSION=3.11 \
  --build-arg NODE_VERSION=18 \
  --platform linux/amd64,linux/arm64 \
  --tag finpal/backend:latest \
  --file dollardollar/Dockerfile \
  --push \
  dollardollar/
```

---

## Quick Reference

### Build and Push

```bash
./build-and-push.sh
```

### Use Pre-built Images

```bash
docker-compose -f docker-compose.hub.yml up -d
```

### Version Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Pull Images

```bash
docker pull finpal/backend:latest
docker pull finpal/web:latest
```

---

## Support

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/finpal/issues)
- **Discord**: [Join our community](https://discord.gg/7Z2EqVZYqm)

---

**Built with care for the community | part of palStack ecosystem**
