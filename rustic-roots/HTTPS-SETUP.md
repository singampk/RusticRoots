# 🔒 HTTPS Setup Guide for therusticroots.com.au

## 🎯 Overview

This guide will help you deploy Rustic Roots with full HTTPS support using:
- **Nginx** as reverse proxy
- **Let's Encrypt** for free SSL certificates
- **Automatic certificate renewal**
- **Security headers and optimizations**

## 📋 Prerequisites

### ✅ Domain Configuration
- Domain `therusticroots.com.au` registered and configured
- DNS A records pointing to your server:
  ```
  therusticroots.com.au     → YOUR_SERVER_IP
  www.therusticroots.com.au → YOUR_SERVER_IP
  ```

### ✅ Server Requirements
- Ubuntu/Debian server with public IP
- Docker and docker-compose installed
- Ports 80 and 443 open in firewall
- Root or sudo access

### ✅ Network Requirements
```bash
# Check if ports are open
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verify DNS resolution
nslookup therusticroots.com.au
```

## 🚀 Quick Setup (Recommended)

### One-Command Deployment
```bash
git clone <repository>
cd rustic-roots
./deploy-https.sh
```

This script will:
1. ✅ Set up environment configuration
2. ✅ Stop existing containers
3. ✅ Pull latest Docker images
4. ✅ Obtain SSL certificates from Let's Encrypt
5. ✅ Start all services with HTTPS
6. ✅ Set up automatic certificate renewal
7. ✅ Verify deployment

## 🔧 Manual Setup

### Step 1: Environment Configuration
```bash
# Create environment file
cp .env.docker .env

# Edit with your configuration
nano .env
```

Required environment variables:
```env
POSTGRES_PASSWORD=your-secure-database-password
NEXTAUTH_SECRET=your-super-secret-jwt-key-64-characters-long
NEXTAUTH_URL=https://therusticroots.com.au
```

### Step 2: SSL Certificate Setup
```bash
# Set up SSL certificates
./setup-ssl.sh therusticroots.com.au admin@therusticroots.com.au
```

### Step 3: Start HTTPS Services
```bash
# Deploy with HTTPS
docker-compose -f docker-compose.ssl.yml up -d
```

### Step 4: Set Up Auto-Renewal
```bash
# Configure automatic SSL renewal
./setup-auto-renewal.sh
```

## 🏗️ Architecture

```
Internet → Nginx (443/80) → Next.js App (3000) → PostgreSQL (5432)
    ↓
Let's Encrypt SSL
    ↓
Auto-renewal cron job
```

### Components:
- **nginx**: Reverse proxy with SSL termination
- **app**: Next.js application (singampk/rusticroots)
- **database**: PostgreSQL with auto-initialization
- **certbot**: SSL certificate management

## 🔒 Security Features

### ✅ SSL/TLS Configuration
- **TLS 1.2 and 1.3** support
- **Strong cipher suites**
- **Perfect Forward Secrecy**
- **SSL stapling**
- **90-day certificate auto-renewal**

### ✅ Security Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### ✅ Rate Limiting
- **API endpoints**: 10 requests/second
- **Authentication**: 5 requests/minute
- **DDoS protection**

### ✅ Performance Optimizations
- **Gzip compression**
- **Static file caching** (1 year)
- **HTTP/2 support**
- **Connection keep-alive**

## 📊 Monitoring & Management

### Check Service Status
```bash
# Container status
docker-compose -f docker-compose.ssl.yml ps

# Service health
curl -I https://therusticroots.com.au
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.ssl.yml logs -f

# Specific service
docker logs rusticroots-nginx
docker logs rusticroots-app
```

### SSL Certificate Management
```bash
# Check certificate status
docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt certbot/certbot certificates

# Manual renewal
./renew-ssl.sh

# Check auto-renewal log
tail -f /var/log/rusticroots-ssl-renewal.log
```

## 🔄 Certificate Renewal

### Automatic Renewal
- **Schedule**: Daily at 3:00 AM and 3:00 PM
- **Trigger**: When certificate expires within 30 days
- **Log**: `/var/log/rusticroots-ssl-renewal.log`

### Manual Renewal
```bash
# Renew certificate
./renew-ssl.sh

# Test renewal (dry run)
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew --dry-run
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Certificate Acquisition Failed
```bash
# Check DNS resolution
nslookup therusticroots.com.au

# Verify port 80 accessibility
curl -I http://therusticroots.com.au/.well-known/acme-challenge/test

# Check Let's Encrypt rate limits
# https://letsencrypt.org/docs/rate-limits/
```

#### 2. Nginx Configuration Issues
```bash
# Test nginx configuration
docker exec rusticroots-nginx nginx -t

# Reload configuration
docker exec rusticroots-nginx nginx -s reload
```

#### 3. SSL Certificate Errors
```bash
# Check certificate validity
openssl s_client -connect therusticroots.com.au:443 -servername therusticroots.com.au

# Verify certificate files
ls -la certbot/conf/live/therusticroots.com.au/
```

#### 4. Application Not Accessible
```bash
# Check app container
docker logs rusticroots-app

# Test internal connectivity
docker exec rusticroots-nginx curl http://app:3000/api/products
```

### Debug Commands
```bash
# Container network inspection
docker network ls
docker network inspect rusticroots_rusticroots-network

# Volume inspection
docker volume ls
docker volume inspect rusticroots_postgres_data

# Full system status
docker-compose -f docker-compose.ssl.yml ps
docker system df
```

## 🔧 Configuration Files

### Key Files
- `nginx/nginx.conf` - Nginx reverse proxy configuration
- `docker-compose.ssl.yml` - HTTPS deployment configuration
- `certbot/conf/` - SSL certificates and configuration
- `.env` - Environment variables

### Customization
```bash
# Edit nginx configuration
nano nginx/nginx.conf

# Restart nginx to apply changes
docker-compose -f docker-compose.ssl.yml restart nginx
```

## 📈 Performance Optimization

### Recommended Settings
```nginx
# In nginx.conf
worker_processes auto;
worker_connections 2048;
keepalive_timeout 65;
client_max_body_size 50M;
```

### Monitoring
```bash
# Nginx access logs
docker exec rusticroots-nginx tail -f /var/log/nginx/access.log

# Performance metrics
docker stats rusticroots-nginx rusticroots-app rusticroots-db
```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest image
docker pull singampk/rusticroots:latest

# Restart services
docker-compose -f docker-compose.ssl.yml up -d
```

### Backup Important Data
```bash
# Backup SSL certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz certbot/

# Backup database
docker exec rusticroots-db pg_dump -U rustic_admin rustic_roots > backup-$(date +%Y%m%d).sql
```

## 🎯 Production Checklist

### Before Going Live
- [ ] DNS records configured and propagated
- [ ] Firewall rules configured (ports 80, 443)
- [ ] SSL certificates obtained and valid
- [ ] Environment variables configured
- [ ] Database initialized with sample data
- [ ] Auto-renewal cron job set up
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented

### Security Hardening
- [ ] Change default database password
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Configure fail2ban for additional protection
- [ ] Set up log monitoring
- [ ] Regular security updates scheduled

---

## 🎉 Success!

Your site should now be available at:
- 🔒 **https://therusticroots.com.au**
- 🔒 **https://www.therusticroots.com.au**

With automatic SSL certificate renewal and production-grade security! 🚀