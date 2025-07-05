# 🐳 Multi-Container SSL Deployment Guide

## 🎯 Architecture Overview

This deployment creates **4 separate Docker containers** for maximum security and flexibility:

```
Internet (443) → Nginx SSL Proxy → Next.js App (3000) → PostgreSQL DB
                      ↓
                 Certbot (Renewal)
```

### 📦 Container Breakdown

| Container | Purpose | Ports | Network |
|-----------|---------|-------|---------|
| **rusticroots-nginx** | SSL termination, reverse proxy | 80, 443 | frontend |
| **rusticroots-app** | Next.js application | 3000 (internal) | frontend, backend |
| **rusticroots-database** | PostgreSQL with sample data | 5432 (internal) | backend |
| **rusticroots-certbot** | SSL certificate management | - | frontend |

### 🛡️ Security Features

- ✅ **Network Isolation**: Backend network is internal-only
- ✅ **SSL Termination**: Only nginx handles HTTPS
- ✅ **No Direct App Exposure**: App only accessible via nginx
- ✅ **Automatic Certificate Renewal**: Certbot handles SSL updates
- ✅ **Rate Limiting**: API and auth endpoint protection

## 🚀 Quick Setup

### One-Command Deployment
```bash
./setup-multi-container.sh therusticroots.com.au
```

This will:
1. Create all 4 containers
2. Set up SSL certificates
3. Configure automatic renewal
4. Test the complete setup

## 📋 Prerequisites

### Domain Configuration
```bash
# DNS A records required:
therusticroots.com.au     → YOUR_SERVER_IP
www.therusticroots.com.au → YOUR_SERVER_IP
```

### Server Requirements
```bash
# Firewall rules
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Docker installed
docker --version
docker-compose --version
```

## 🔧 Manual Setup Steps

### Step 1: Environment Setup
```bash
# Copy environment template
cp .env.https .env

# Edit with your configuration
nano .env
```

### Step 2: Start Database and App
```bash
docker-compose -f docker-compose.multi-container.yml up -d database app

# Wait for services
sleep 30

# Verify app is working
docker exec rusticroots-app curl http://localhost:3000/api/products
```

### Step 3: Obtain SSL Certificate
```bash
# Start temporary nginx for challenge
docker run -d --name temp-nginx \
    --network rusticroots_frontend \
    -p 80:80 \
    -v $(pwd)/nginx/temp-http.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot/www:/var/www/certbot:ro \
    nginx:alpine

# Get certificate
docker run --rm \
    --network rusticroots_frontend \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot \
    certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@therusticroots.com.au \
    --agree-tos --no-eff-email \
    -d therusticroots.com.au -d www.therusticroots.com.au

# Clean up temporary nginx
docker stop temp-nginx && docker rm temp-nginx
```

### Step 4: Start Production Nginx
```bash
docker-compose -f docker-compose.multi-container.yml up -d nginx
```

## 🛠️ Container Management

### Using the Management Script
```bash
# Container operations
./manage-containers.sh start     # Start all containers
./manage-containers.sh stop      # Stop all containers
./manage-containers.sh restart   # Restart all containers
./manage-containers.sh status    # Show status

# Monitoring
./manage-containers.sh logs      # Show all logs
./manage-containers.sh logs app  # Show app logs only
./manage-containers.sh health    # System health check

# Maintenance
./manage-containers.sh update    # Update app to latest
./manage-containers.sh backup    # Create backup
./manage-containers.sh ssl       # Check SSL status
./manage-containers.sh clean     # Clean up Docker
```

### Direct Docker Commands
```bash
# Container status
docker-compose -f docker-compose.multi-container.yml ps

# Individual container logs
docker logs rusticroots-nginx
docker logs rusticroots-app
docker logs rusticroots-database

# Execute commands in containers
docker exec rusticroots-app curl http://localhost:3000/api/products
docker exec rusticroots-database psql -U rustic_admin rustic_roots
docker exec rusticroots-nginx nginx -t
```

## 🔒 SSL Certificate Management

### Automatic Renewal
- **Schedule**: Daily at 2:00 AM and 2:00 PM
- **Log**: `/var/log/rusticroots-ssl-renewal.log`
- **Health Check**: Weekly on Sundays at 6:00 AM

### Manual Certificate Operations
```bash
# Renew certificates manually
./renew-certificates.sh

# Check certificate status
./check-ssl-health.sh

# View certificate details
openssl x509 -in certbot/conf/live/therusticroots.com.au/fullchain.pem -text

# Test SSL configuration
echo | openssl s_client -servername therusticroots.com.au -connect therusticroots.com.au:443
```

## 📊 Monitoring & Troubleshooting

### Health Checks
```bash
# System overview
./manage-containers.sh health

# Individual service checks
curl -I https://therusticroots.com.au
curl -I https://therusticroots.com.au/api/products
curl -I https://therusticroots.com.au/health
```

### Common Issues

#### 1. Certificate Not Working
```bash
# Check certificate files
ls -la certbot/conf/live/therusticroots.com.au/

# Verify nginx can read certificates
docker exec rusticroots-nginx ls -la /etc/letsencrypt/live/therusticroots.com.au/

# Test nginx configuration
docker exec rusticroots-nginx nginx -t
```

#### 2. App Not Responding
```bash
# Check app health
docker exec rusticroots-app curl http://localhost:3000/api/products

# Check database connection
docker exec rusticroots-app npx prisma db push

# View app logs
docker logs rusticroots-app -f
```

#### 3. Database Issues
```bash
# Check database status
docker exec rusticroots-database pg_isready -U rustic_admin

# Connect to database
docker exec -it rusticroots-database psql -U rustic_admin rustic_roots

# Check sample data
docker exec rusticroots-database psql -U rustic_admin -d rustic_roots -c "SELECT COUNT(*) FROM \"Product\";"
```

### Performance Monitoring
```bash
# Container resource usage
docker stats

# Nginx access logs
docker exec rusticroots-nginx tail -f /var/log/nginx/access.log

# Database performance
docker exec rusticroots-database psql -U rustic_admin -d rustic_roots -c "
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables;"
```

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Update to latest version
./manage-containers.sh update

# Manual update process
docker pull singampk/rusticroots:latest
docker-compose -f docker-compose.multi-container.yml up -d app
```

### System Maintenance
```bash
# Create backup before maintenance
./manage-containers.sh backup

# Clean up unused resources
./manage-containers.sh clean

# Check system health after changes
./manage-containers.sh health
```

### Configuration Updates
```bash
# Update nginx configuration
nano nginx/ssl-proxy.conf
docker-compose -f docker-compose.multi-container.yml restart nginx

# Update environment variables
nano .env
docker-compose -f docker-compose.multi-container.yml up -d app
```

## 💾 Backup & Restore

### Create Backup
```bash
./manage-containers.sh backup
```
Creates timestamped backup with:
- Database dump
- SSL certificates
- Configuration files
- Environment settings

### Restore from Backup
```bash
./manage-containers.sh restore backups/20231201-120000
```

### Manual Backup Operations
```bash
# Database backup
docker exec rusticroots-database pg_dump -U rustic_admin rustic_roots > backup-$(date +%Y%m%d).sql

# SSL certificates backup
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz certbot/conf/

# Configuration backup
cp .env docker-compose.multi-container.yml nginx/ssl-proxy.conf backups/
```

## 🎯 Production Checklist

### Before Going Live
- [ ] DNS records pointing to server
- [ ] Firewall configured (ports 80, 443)
- [ ] SSL certificates obtained and valid
- [ ] All containers healthy and responding
- [ ] Sample data loaded in database
- [ ] Auto-renewal cron job configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented

### Security Hardening
- [ ] Change default database password
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Configure fail2ban
- [ ] Set up log monitoring
- [ ] Regular security updates
- [ ] Network segmentation verified

---

## 🎉 Success!

Your multi-container SSL deployment is now running with:

- 🔒 **HTTPS**: https://therusticroots.com.au
- 🛡️ **Security**: Network isolation and SSL termination
- 🔄 **Auto-renewal**: Automatic SSL certificate updates  
- 📊 **Monitoring**: Health checks and logging
- 💾 **Backup**: Automated backup capabilities

**4 containers working together for maximum security and reliability!** 🚀