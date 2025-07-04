# 🐳 Docker Deployment Guide

## 📦 Published Docker Image

The Rustic Roots application is available on Docker Hub:

**Image:** `singampk/rusticroots:latest`  
**Registry:** https://hub.docker.com/r/singampk/rusticroots

## 🚀 Quick Start

### Option 1: One-click deployment (Recommended)
```bash
git clone <repository>
cd rustic-roots
./deploy-production.sh
```

### Option 2: Manual deployment
```bash
# Pull the image
docker pull singampk/rusticroots:latest

# Start with docker-compose
docker-compose -f docker-compose.production.yml up -d
```

### Option 3: Direct Docker run
```bash
# Start database
docker run -d --name rusticroots-db \
  -e POSTGRES_DB=rustic_roots \
  -e POSTGRES_USER=rustic_admin \
  -e POSTGRES_PASSWORD=RusticRoots2024! \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15

# Start application
docker run -d --name rusticroots-app \
  -e DATABASE_URL="postgresql://rustic_admin:RusticRoots2024!@rusticroots-db:5432/rustic_roots" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  -p 3000:3000 \
  --link rusticroots-db \
  singampk/rusticroots:latest
```

## 🎯 Features

### ✅ **Auto-Initialization**
- Database automatically creates all tables
- Sample data included (10 products, 2 users, sample orders)
- No manual setup required

### ✅ **Pre-seeded Data**
- **Products**: 10 furniture items with descriptions and pricing
- **Users**: Admin and customer accounts ready to use
- **Orders**: Sample order history for testing

### ✅ **Production Ready**
- Multi-stage Docker build optimized for size
- Health checks for both database and application
- Automatic restarts on failure
- Secure non-root user execution

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@therusticroots.com.au | password123 |
| Customer | john@example.com | password123 |

## 🌐 Access Points

- **Application**: http://localhost:3000
- **Database**: localhost:5432
- **Admin Panel**: http://localhost:3000/admin

## 📊 Container Details

| Service | Image | Ports | Health Check |
|---------|-------|-------|--------------|
| App | singampk/rusticroots:latest | 3000 | /api/products |
| Database | postgres:15 | 5432 | pg_isready |

## 🛠️ Management Commands

```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f

# Stop services
docker-compose -f docker-compose.production.yml down

# Restart services
docker-compose -f docker-compose.production.yml restart

# Update to latest image
docker pull singampk/rusticroots:latest
docker-compose -f docker-compose.production.yml up -d
```

## 🔧 Environment Variables

Create a `.env` file for custom configuration:

```env
# Database
POSTGRES_PASSWORD=your-secure-password

# Application
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000

# AWS (Optional - for file uploads)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET_NAME=your-bucket
```

## 📋 Database Schema

The database includes the following tables:
- **User** - User accounts with roles (ADMIN/USER)
- **Product** - Furniture products with pricing and descriptions
- **Order** - Customer orders with status tracking
- **OrderItem** - Individual items within orders

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │────│   PostgreSQL    │
│  (Port 3000)    │    │   (Port 5432)   │
│                 │    │                 │
│ singampk/       │    │ postgres:15     │
│ rusticroots     │    │ + init script   │
└─────────────────┘    └─────────────────┘
```

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Check if database is ready
docker exec rusticroots-db pg_isready -U rustic_admin

# View database logs
docker logs rusticroots-db
```

### Application Issues
```bash
# Check application health
curl http://localhost:3000/api/products

# View application logs
docker logs rusticroots-app
```

### Reset Everything
```bash
# Stop and remove containers and volumes
docker-compose -f docker-compose.production.yml down -v

# Start fresh
./deploy-production.sh
```

## 📈 Scaling

For production scaling, consider:
- Using external PostgreSQL (AWS RDS, etc.)
- Load balancing multiple app containers
- Using container orchestration (Kubernetes, Docker Swarm)
- Configuring reverse proxy (nginx, Traefik)

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for secrets
- Enable SSL/TLS for production deployments
- Regularly update Docker images
- Use secrets management for sensitive data

---

🎉 **Ready to deploy!** The application will be available at http://localhost:3000 with full functionality and sample data.