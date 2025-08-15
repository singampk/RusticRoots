# Rustic Roots - Production Deployment Guide

## Overview

This document provides comprehensive deployment instructions for the Rustic Roots e-commerce platform on AWS Lightsail.

## Quick Start

```bash
# Full deployment with testing
./deploy.sh v1.6.3

# Quick deployment (emergency fixes)
./quick-deploy.sh v1.6.3
```

## Infrastructure

### AWS Lightsail Instance
- **IP**: 13.238.116.88
- **Domain**: therusticroots.com.au
- **OS**: Ubuntu 20.04 LTS
- **Instance Type**: Standard
- **Region**: ap-southeast-2 (Sydney)

### Database (AWS RDS)
- **Engine**: PostgreSQL 13
- **Host**: ls-7b3c5452a0d018ecde3cd4a954068673e81d9dc2.cli0gkwcy4ii.ap-southeast-2.rds.amazonaws.com
- **Database**: rustic_roots
- **Port**: 5432
- **SSL**: Required

### Docker Registry
- **Repository**: singampk/rusticroots
- **Platform**: Docker Hub
- **Current Version**: v1.6.2

## Deployment Methods

### 1. Automated Deployment (Recommended)

**Full deployment with testing:**
```bash
./deploy.sh v1.6.3
```

This script performs:
- ✅ ESLint and TypeScript checking
- 🏗️ Local build and testing
- 🐋 Docker image build and local testing
- 📤 Push to Docker Hub
- 🚀 Production deployment
- ✅ Health check verification

**Quick deployment (emergency fixes):**
```bash
./quick-deploy.sh v1.6.3
```

This script performs:
- 🏗️ Docker build (no testing)
- 📤 Push to Docker Hub
- 🚀 Direct production deployment

### 2. Manual Deployment

**Step 1: Build and test locally**
```bash
cd rustic-roots
npm run lint
npm run typecheck
npm run build
```

**Step 2: Build Docker image**
```bash
docker build -t singampk/rusticroots:v1.6.3 .
```

**Step 3: Test Docker image**
```bash
# Start container
docker run -d -p 3001:3000 --name test-container singampk/rusticroots:v1.6.3

# Health check
curl http://localhost:3001/api/healthz

# Cleanup
docker stop test-container && docker rm test-container
```

**Step 4: Push to Docker Hub**
```bash
docker login
docker push singampk/rusticroots:v1.6.3
```

**Step 5: Deploy to production**
```bash
# SSH to server
ssh -i ~/Downloads/LightsailDefaultKey-ap-southeast-2.pem ubuntu@13.238.116.88

# Navigate to app directory
cd /apps/rustic_roots

# Update image version
sed -i 's/v1\.6\.2/v1.6.3/g' docker-compose.prod-ssl.yml

# Deploy
/usr/local/bin/docker-compose -f docker-compose.prod-ssl.yml pull app
/usr/local/bin/docker-compose -f docker-compose.prod-ssl.yml up -d app

# Verify
docker logs rusticroots-app-prod --tail 20
```

## Server Configuration

### Directory Structure
```
/apps/
├── rustic_roots/           # Application directory
│   ├── docker-compose.prod-ssl.yml
│   ├── init-ssl.sh
│   ├── renew-ssl.sh
│   └── fix-images.sql
├── nginx/
│   └── ssl-prod.conf       # Nginx configuration
└── certbot/
    ├── conf/               # SSL certificates
    └── www/                # ACME challenge
```

### Docker Services

**Application Container:**
- **Name**: rusticroots-app-prod
- **Image**: singampk/rusticroots:latest
- **Port**: 3000 (internal)
- **Health Check**: /api/healthz

**Nginx Container:**
- **Name**: rusticroots-nginx-prod
- **Ports**: 80, 443
- **Purpose**: SSL termination and reverse proxy

**Certbot Container:**
- **Name**: rusticroots-certbot
- **Purpose**: SSL certificate management

## Database Management

### Connection
```bash
# Using master credentials
PGPASSWORD='[master-password]' psql -h ls-7b3c5452a0d018ecde3cd4a954068673e81d9dc2.cli0gkwcy4ii.ap-southeast-2.rds.amazonaws.com -U dbadmin -d rustic_roots

# Using application credentials  
PGPASSWORD='[app-password]' psql -h [rds-host] -U rustic_user -d rustic_roots
```

### Default Admin Account
- **Email**: admin@therusticroots.com.au
- **Role**: ADMIN
- **Password**: Set during initial setup

### Sample Data
The database includes sample products with placeholder images from Unsplash.

## SSL Certificate Management

### Auto-renewal (Configured)
```bash
# Cron job runs every Sunday at 2 AM
0 2 * * 0 /apps/rustic_roots/renew-ssl.sh
```

### Manual renewal
```bash
cd /apps/rustic_roots
./renew-ssl.sh
```

### Certificate status
```bash
# Check expiry
openssl x509 -in /apps/certbot/conf/live/therusticroots.com.au/fullchain.pem -text -noout | grep "Not After"

# SSL Labs test
curl -s "https://api.ssllabs.com/api/v3/analyze?host=therusticroots.com.au"
```

## Monitoring & Troubleshooting

### Health Checks
- **Application**: https://therusticroots.com.au/api/healthz
- **SSL**: https://www.ssllabs.com/ssltest/analyze.html?d=therusticroots.com.au

### Log Monitoring
```bash
# Application logs
docker logs rusticroots-app-prod -f

# Nginx logs
docker logs rusticroots-nginx-prod -f

# System logs
sudo journalctl -u docker -f
```

### Common Issues

**1. Application won't start**
```bash
# Check logs
docker logs rusticroots-app-prod

# Check environment
docker exec rusticroots-app-prod env | grep DATABASE_URL

# Restart service
/usr/local/bin/docker-compose -f docker-compose.prod-ssl.yml restart app
```

**2. SSL certificate issues**
```bash
# Check certificate
openssl x509 -in /apps/certbot/conf/live/therusticroots.com.au/fullchain.pem -text -noout

# Renew certificate
./renew-ssl.sh

# Check nginx config
docker exec rusticroots-nginx-prod nginx -t
```

**3. Database connection issues**
```bash
# Test connection
PGPASSWORD='[password]' psql -h [rds-host] -U rustic_user -d rustic_roots -c "SELECT 1;"

# Check RDS instance status in AWS console
```

**4. Image loading issues**
```bash
# Update image URLs
PGPASSWORD='[password]' psql -h [rds-host] -U dbadmin -d rustic_roots -f fix-images.sql
```

### Performance Monitoring
```bash
# System resources
top
df -h
free -m

# Docker resources
docker stats
docker system df

# Network connectivity
curl -I https://therusticroots.com.au
```

## Backup & Recovery

### Database Backup
```bash
# Create backup
PGPASSWORD='[password]' pg_dump -h [rds-host] -U dbadmin rustic_roots > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
PGPASSWORD='[password]' psql -h [rds-host] -U dbadmin rustic_roots < backup_file.sql
```

### Configuration Backup
- All configuration files are versioned in Git
- Docker images are stored in Docker Hub
- SSL certificates are auto-managed by Let's Encrypt

## Security

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://rustic_user:[password]@[rds-host]:5432/rustic_roots?sslmode=require
NEXTAUTH_SECRET=[secure-random-string]
NEXTAUTH_URL=https://therusticroots.com.au
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=[access-key]
AWS_SECRET_ACCESS_KEY=[secret-key]
AWS_S3_BUCKET_NAME=files.therusticroots.com.au
```

### Firewall Configuration
- **SSH (22)**: Restricted to specific IPs
- **HTTP (80)**: Open (redirects to HTTPS)
- **HTTPS (443)**: Open
- **App (3000)**: Internal only

### Security Headers
- HSTS enabled
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection enabled
- Rate limiting on API endpoints

## Version History

- **v1.6.2**: Fixed S3 image loading issues, updated Next.js image configuration
- **v1.6.1**: Added SSL support, nginx reverse proxy
- **v1.6.0**: Initial production deployment
- **v1.5.x**: Development versions

## Support

### Emergency Contacts
- **Domain Registrar**: Route 53
- **SSL Provider**: Let's Encrypt
- **Hosting**: AWS Lightsail
- **Database**: AWS RDS

### Useful Links
- **Application**: https://therusticroots.com.au
- **Admin Panel**: https://therusticroots.com.au/admin
- **Health Check**: https://therusticroots.com.au/api/healthz
- **SSL Test**: https://www.ssllabs.com/ssltest/analyze.html?d=therusticroots.com.au