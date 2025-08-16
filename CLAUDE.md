# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
cd rustic-roots
npm install         # Install dependencies
npm run dev        # Start development server with Turbopack (http://localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

### Database (Prisma)
```bash
cd rustic-roots
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open Prisma Studio (database GUI)
npx prisma migrate dev # Create and apply migrations
npx prisma db seed     # Seed database with sample data
```

### Environment Setup
```bash
# Copy environment variables template
cp .env.example .env.local

# Required environment variables:
DATABASE_URL="postgresql://username:password@localhost:5432/rustic_roots"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Architecture

**Rustic Roots** is a full-stack e-commerce platform for custom wood furniture, built with modern web technologies.

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript with strict mode
- **State Management**: React Context API (Cart functionality)
- **Image Handling**: Next.js Image component with optimization

### Application Structure

#### Frontend Architecture (`/src/app/`)
**App Router Pages:**
- `/` - Homepage with hero section and featured products
- `/products` - Product catalog with filtering and sorting
- `/about` - Company information and story
- `/contact` - Contact form and company details
- `/cart` - Shopping cart with quantity management
- `/checkout` - Order placement and payment
- `/orders` - User order history and tracking
- `/profile` - User profile management with tabs
- `/admin` - Admin dashboard for product management
- `/auth/signin` - Authentication page
- `/auth/signup` - User registration

**Static Pages:**
- `/faq` - Frequently asked questions with categories
- `/returns` - Return policy and process
- `/warranty` - Lifetime warranty information
- `/care` - Furniture care instructions
- `/shipping` - Shipping information and policies

#### Backend Architecture (`/pages/api/`)
**API Endpoints:**
- `/api/auth/[...nextauth]` - NextAuth.js authentication
- `/api/auth/register` - User registration
- `/api/products` - Product CRUD operations
- `/api/users` - User management (Admin only)
- `/api/orders` - Order management

#### Database Schema (`/prisma/schema.prisma`)
**Core Models:**
```prisma
User {
  id: String (UUID)
  name: String
  email: String (unique)
  password: String
  role: Role (USER | ADMIN)
  products: Product[]
  orders: Order[]
  createdAt: DateTime
  updatedAt: DateTime
}

Product {
  id: String (UUID)
  name: String
  description: String
  price: Decimal
  images: String[]
  category: String
  stock: Int
  ownerId: String
  owner: User
  orderItems: OrderItem[]
  createdAt: DateTime
  updatedAt: DateTime
}

Order {
  id: String (UUID)
  orderNumber: String (unique)
  userId: String
  user: User
  items: OrderItem[]
  total: Decimal
  status: OrderStatus
  shippingAddress: Json
  createdAt: DateTime
  updatedAt: DateTime
}

OrderItem {
  id: String (UUID)
  orderId: String
  order: Order
  productId: String
  product: Product
  quantity: Int
  price: Decimal
}
```

### Component Architecture

#### Reusable Components (`/src/components/`)
- **Header**: Navigation with cart counter and user menu
- **ProductCard**: Product display with add-to-cart functionality
- **CartContext**: Global cart state management

#### Key Features

**Shopping Cart:**
- Persistent localStorage storage
- Real-time quantity updates
- Visual feedback animations
- Cart icon with animated count

**Authentication:**
- JWT-based session management
- Role-based access control (USER/ADMIN)
- Protected routes and API endpoints
- Social auth integration ready

**Product Management:**
- Image optimization and placeholder support
- Category filtering and price sorting
- Stock management
- Admin-only product creation/editing

**Order System:**
- Order history with status tracking
- Mock order data for development
- Detailed order information
- Shipping address management

### Security Features

#### Authentication & Authorization
- **JWT Tokens**: Secure session management
- **Role-based Access**: Admin vs User permissions
- **Protected Routes**: Automatic signin redirection
- **API Security**: Middleware validation on all protected endpoints

#### Data Protection
- **Input Validation**: Type checking and sanitization
- **CORS Protection**: Restricted API access
- **Environment Variables**: Secure configuration management
- **Database Security**: Parameterized queries via Prisma

### Development Patterns

#### Code Organization
```
rustic-roots/
├── src/
│   ├── app/                    # App Router pages
│   ├── components/             # Reusable components
│   ├── context/               # React Context providers
│   └── lib/                   # Utility functions
├── pages/api/                 # API routes (Pages Router)
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── docs/                      # Documentation
```

#### Naming Conventions
- **Components**: PascalCase (`ProductCard.tsx`)
- **Pages**: lowercase with hyphens (`about/page.tsx`)
- **API Routes**: RESTful naming (`/api/products`)
- **Database**: camelCase fields, PascalCase models

#### State Management
- **Local State**: useState for component-specific data
- **Global State**: Context API for cart functionality
- **Server State**: Direct API calls with loading states
- **Form State**: Controlled components with validation

### Development Setup

#### Prerequisites
1. **Node.js** (v18 or higher)
2. **PostgreSQL** database
3. **npm** or **yarn** package manager

#### Bootstrap Instructions
```bash
# 1. Clone and navigate to project
cd rustic-roots

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# 4. Set up database
npx prisma db push
npx prisma db seed

# 5. Start development server
npm run dev
```

#### Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE rustic_roots;

-- Create user (optional)
CREATE USER rustic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rustic_roots TO rustic_user;
```

### Testing Strategy

#### Manual Testing Checklist

**Authentication:**
- [ ] User registration with validation
- [ ] Sign in/out functionality
- [ ] Protected route redirection
- [ ] Role-based access control

**Product Catalog:**
- [ ] Product listing and filtering
- [ ] Product detail views
- [ ] Search functionality
- [ ] Category navigation

**Shopping Cart:**
- [ ] Add/remove items
- [ ] Quantity adjustments
- [ ] Cart persistence across sessions
- [ ] Checkout process

**Admin Functions:**
- [ ] Product creation/editing
- [ ] User management
- [ ] Order monitoring
- [ ] Dashboard access control

**Responsive Design:**
- [ ] Mobile navigation
- [ ] Touch-friendly interactions
- [ ] Tablet layout optimization
- [ ] Desktop feature completeness

#### Performance Testing
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Bundle Analysis**: Check for code splitting effectiveness
- **Database Queries**: Monitor via Prisma logging
- **Image Optimization**: Verify Next.js image loading

### Production Considerations

#### Environment Variables
```bash
DATABASE_URL="postgresql://..."  # Production database
NEXTAUTH_SECRET="..."           # Secure random string
NEXTAUTH_URL="https://..."      # Production domain
```

#### Deployment Checklist
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Static assets optimized
- [ ] HTTPS certificates installed
- [ ] Database backups configured

#### Performance Optimizations
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic with App Router
- **Static Generation**: Pre-rendered pages where possible
- **Database Indexing**: Optimized queries via Prisma

### Troubleshooting

#### Common Issues
1. **Database Connection**: Check DATABASE_URL format
2. **Authentication**: Verify NEXTAUTH_SECRET is set
3. **Build Errors**: Run `npm run lint` and `npm run typecheck`
4. **Missing Dependencies**: Run `npm install`

#### Debug Commands
```bash
# Check database connection
npx prisma db pull

# Verify environment variables
npm run dev -- --debug

# Analyze bundle size
npm run build -- --analyze
```

### File Organization

#### Key Directories
- `/src/app/` - App Router pages and layouts
- `/src/components/` - Reusable UI components
- `/src/context/` - React Context providers
- `/pages/api/` - API endpoints (Pages Router)
- `/prisma/` - Database schema and seeds
- `/public/` - Static assets and images
- `/docs/` - Project documentation

#### Important Files
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.local` - Environment variables (not in git)

### API Reference

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handler

#### Product Endpoints
- `GET /api/products` - List products (public)
- `POST /api/products` - Create product (admin only)

#### User Endpoints
- `GET /api/users` - List users (admin only)
- `PATCH /api/users/[id]` - Update user (admin only)
- `DELETE /api/users/[id]` - Delete user (admin only)

## Production Deployment

### AWS Lightsail Setup

**Instance Details:**
- **Server**: AWS Lightsail Ubuntu 20.04 LTS
- **IP Address**: 13.238.116.88
- **Domain**: therusticroots.com.au
- **SSH Key**: LightsailDefaultKey-ap-southeast-2.pem
- **User**: ubuntu

**Firewall Configuration:**
- Port 22 (SSH)
- Port 80 (HTTP) - redirects to HTTPS
- Port 443 (HTTPS)
- Port 3000 (Next.js app) - internal only

### Database Configuration

**AWS RDS PostgreSQL:**
- **Host**: ls-7b3c5452a0d018ecde3cd4a954068673e81d9dc2.cli0gkwcy4ii.ap-southeast-2.rds.amazonaws.com
- **Port**: 5432
- **Database**: rustic_roots
- **Master User**: dbadmin
- **Application User**: rustic_user
- **Region**: ap-southeast-2
- **SSL Mode**: require

**Default Admin Account:**
- **Email**: admin@therusticroots.com.au
- **Role**: ADMIN
- **Access**: Full admin dashboard and user management

### Docker Configuration

**Docker Images:**
- **Registry**: Docker Hub (singampk/rusticroots)
- **Current Version**: v1.6.6-fixed
- **Base Image**: node:18-alpine
- **Output**: Next.js standalone mode

### SSL/HTTPS Setup

**Let's Encrypt Configuration:**
- **Certificate Authority**: Let's Encrypt
- **Domains**: therusticroots.com.au, www.therusticroots.com.au
- **Auto-renewal**: Configured via cron (Sundays 2 AM)
- **Nginx**: Reverse proxy with SSL termination

### Deployment Architecture

```
[Internet] → [Nginx:443/80] → [Next.js App:3000] → [RDS PostgreSQL:5432]
    ↓             ↓                    ↓
[Route 53]   [Let's Encrypt]    [Docker Container]
```

### Connecting to Production Server

```bash
# SSH into Lightsail instance (alias configured)
ssh lightsail-default

# Navigate to application directory
cd /apps/rusticroots

# Check running services
docker ps
docker logs rusticroots-app-prod
```

### Database Access

```bash
# Connect to production database
PGPASSWORD='[master-password]' psql -h ls-7b3c5452a0d018ecde3cd4a954068673e81d9dc2.cli0gkwcy4ii.ap-southeast-2.rds.amazonaws.com -U dbadmin -d rustic_roots

# Or using application user
PGPASSWORD='[app-password]' psql -h [rds-host] -U rustic_user -d rustic_roots

# Run database queries
\dt                              # List tables
SELECT * FROM "User" LIMIT 5;    # View users
SELECT * FROM "Product" LIMIT 5; # View products
```

### Manual Deployment Steps

1. **Build and Push Docker Image:**
   ```bash
   cd rustic-roots
   docker build -t singampk/rusticroots:v1.6.X .
   docker push singampk/rusticroots:v1.6.X
   
   # Update local docker-compose file with new version
   ```

2. **Update Production:**
   ```bash
   # Copy updated docker-compose to Lightsail
   scp docker-compose.prod-ssl.yml lightsail-default:/apps/rusticroots/
   
   # SSH to server
   ssh lightsail-default
   
   # Navigate to app directory
   cd /apps/rusticroots
   
   # Deploy new version
   docker-compose -f docker-compose.prod-ssl.yml pull app
   docker-compose -f docker-compose.prod-ssl.yml up -d app
   
   # Verify deployment
   docker logs rusticroots-app-prod --tail 20
   ```

3. **Database Updates (if needed):**
   ```bash
   # Run SQL updates
   PGPASSWORD='[password]' psql -h [rds-host] -U dbadmin -d rustic_roots -f update-script.sql
   ```

### Production Monitoring

**Health Checks:**
- Application: https://therusticroots.com.au/api/healthz
- Nginx: https://therusticroots.com.au/health
- SSL Certificate: https://www.ssllabs.com/ssltest/

**Log Locations:**
```bash
# Application logs
docker logs rusticroots-app-prod

# Nginx logs
docker logs rusticroots-nginx-prod
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# SSL certificate renewal logs
sudo tail -f /var/log/cron.log
```

**Performance Monitoring:**
```bash
# System resources
top
df -h
free -m

# Docker resources
docker stats
docker system df
```

### SSL Certificate Management

**Manual Certificate Renewal:**
```bash
# Run renewal script
cd /apps/rustic_roots
./renew-ssl.sh

# Or manual renewal
/usr/local/bin/docker-compose -f docker-compose.prod-ssl.yml run --rm certbot renew
docker exec rusticroots-nginx-prod nginx -s reload
```

**Auto-renewal Cron Job:**
```bash
# Check crontab
sudo crontab -l

# Add if missing
0 2 * * 0 /apps/rustic_roots/renew-ssl.sh
```

### Security Configuration

**Environment Variables (Production):**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://rustic_user:[password]@[rds-host]:5432/rustic_roots?sslmode=require
NEXTAUTH_SECRET=[secure-secret]
NEXTAUTH_URL=https://therusticroots.com.au
AWS_REGION=ap-southeast-2
# AWS credentials for S3 access
```

**Nginx Security Headers:**
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Rate limiting for API endpoints

### Backup Strategy

**Database Backups:**
```bash
# Create backup
PGPASSWORD='[password]' pg_dump -h [rds-host] -U dbadmin rustic_roots > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
PGPASSWORD='[password]' psql -h [rds-host] -U dbadmin rustic_roots < backup_file.sql
```

**Application Backups:**
- Docker images stored in Docker Hub
- Configuration files in Git repository
- SSL certificates auto-managed by Let's Encrypt

### Troubleshooting Production Issues

**Common Issues:**

1. **Application Not Starting:**
   ```bash
   docker logs rusticroots-app-prod
   docker exec -it rusticroots-app-prod sh
   ```

2. **SSL Certificate Issues:**
   ```bash
   # Check certificate expiry
openssl x509 -in /apps/certbot/conf/live/therusticroots.com.au/fullchain.pem -text -noout | grep "Not After"
   
   # Force certificate renewal
   ./renew-ssl.sh
   ```

3. **Database Connection Issues:**
   ```bash
   # Test connection
   PGPASSWORD='[password]' psql -h [rds-host] -U rustic_user -d rustic_roots -c "SELECT 1;"
   
   # Check environment variables
   docker exec rusticroots-app-prod env | grep DATABASE_URL
   ```

4. **Performance Issues:**
   ```bash
   # Check system resources
   top
   docker stats
   
   # Restart services
   /usr/local/bin/docker-compose -f docker-compose.prod-ssl.yml restart
   ```

## Shared Infrastructure with NulaEggs

RusticRoots shares production infrastructure with NulaEggs on the same Lightsail instance:

### Multi-Domain Configuration
- **Nginx Config**: Uses multi-domain configuration (`nginx/ssl-prod-multi.conf`)
- **Shared Services**: certbot, nginx containers managed from RusticRoots
- **Network**: Both applications use `rustic_roots_frontend` Docker network
- **Database**: Same RDS instance, separate databases

### Current Deployment Status
- **Domain**: https://therusticroots.com.au
- **Container**: `singampk/rusticroots:v1.6.6-fixed`
- **Infrastructure**: Primary application managing shared services
- **SSL**: Let's Encrypt certificates for both domains

### File Synchronization

**IMPORTANT**: Always maintain local-Lightsail file synchronization:

#### Key Files to Keep in Sync:
- `docker-compose.prod-ssl.yml` → `/apps/rusticroots/docker-compose.prod-ssl.yml`
- `nginx/ssl-prod.conf` → Single domain config (not used in production)
- Shared nginx config managed by NulaEggs project

#### Verification Commands:
```bash
# Compare local vs Lightsail files
diff docker-compose.prod-ssl.yml <(ssh lightsail-default cat /apps/rusticroots/docker-compose.prod-ssl.yml)

# The nginx config on Lightsail is the multi-domain version from NulaEggs project
```

### Related Projects
- **NulaEggs**: Shares infrastructure (`/Users/singampk/work/exp/NulaEggs`)
- **Multi-domain nginx**: Managed from NulaEggs project

### Development Notes
- Uses PostgreSQL as primary database
- TypeScript with strict mode enabled
- ESLint configuration for Next.js
- Path alias `@/*` maps to `./src/*`
- Hot reload enabled in development
- Automatic TypeScript checking on build
- Production deployment on AWS Lightsail with Docker
- SSL termination via Nginx with Let's Encrypt certificates
- Automated image builds pushed to Docker Hub
- Shares production infrastructure with NulaEggs application