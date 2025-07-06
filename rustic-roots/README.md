# Rustic Roots - E-commerce Platform

A full-stack e-commerce platform for custom wood furniture with promotion management system.

## Quick Start

Choose your preferred development environment:

### 1. Local Development (Fastest for development)
```bash
./local-dev.sh
```
- **URL**: http://localhost:3000
- **Features**: Hot reload, fastest startup
- **Use case**: Active development

### 2. Docker Local HTTP
```bash
./docker-local-http.sh start
```
- **URL**: http://localhost:3000
- **Features**: Production-like environment, HTTP only
- **Use case**: Testing without SSL complexity

### 3. Docker Local HTTPS
```bash
./docker-local-https.sh start
```
- **URL**: https://therusticroots.local
- **Features**: Full HTTPS with locally-trusted certificates
- **Use case**: Testing SSL features locally

### 4. Docker Production HTTPS
```bash
./docker-prod-https.sh start
```
- **URL**: https://therusticroots.com.au
- **Features**: Production environment with Let's Encrypt SSL
- **Use case**: Production deployment

## Test Accounts

**Admin Access:**
- Email: `admin@therusticroots.com.au`
- Password: `password123`
- Access: Full admin panel, promotion management

**User Access:**
- Email: `john@example.com`
- Password: `password123`
- Access: Shopping, orders, profile

## Key Features

### E-commerce Core
- Product catalog with categories and search
- Shopping cart with persistent storage
- User authentication and profiles
- Order management and tracking
- Admin dashboard for product management

### Promotion System
- **Promotion Types**: Fixed amount or percentage discounts
- **Usage Control**: One-time or multiple-use codes
- **Advanced Rules**: Minimum order values, maximum discounts
- **Expiration Dates**: Time-based validity
- **Order Tracking**: Promotion details stored with orders
- **Admin Management**: Full CRUD operations for promotions

**Test Promotion Codes:**
- `WELCOME10` - 10% off (multiple use)
- `SUMMER50` - $50 off orders over $500
- `FREESHIP` - $25 off (shipping discount)

### Security Features
- JWT-based authentication with NextAuth.js
- Role-based access control (Admin/User)
- Rate limiting on API endpoints
- HTTPS with modern SSL configuration
- Security headers (HSTS, CSP, etc.)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT
- **Deployment**: Docker, nginx, Let's Encrypt
- **Image Handling**: Next.js Image optimization

## Development Commands

### Local Development
```bash
# Start development server
./local-dev.sh

# Install dependencies
npm install

# Database operations
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma studio  # Database GUI
```

### Docker Commands

**Local HTTP:**
```bash
./docker-local-http.sh start    # Start containers
./docker-local-http.sh stop     # Stop containers
./docker-local-http.sh logs     # View logs
./docker-local-http.sh restart  # Restart containers
```

**Local HTTPS:**
```bash
./docker-local-https.sh start       # Start with HTTPS
./docker-local-https.sh install-ca  # Install certificate authority
./docker-local-https.sh stop        # Stop containers
```

**Production HTTPS:**
```bash
./docker-prod-https.sh start        # Start production with SSL
./docker-prod-https.sh start 1      # Start with staging SSL (testing)
./docker-prod-https.sh renew-ssl    # Renew SSL certificates
./docker-prod-https.sh get-ssl      # Get new SSL certificate
```

## Environment Configuration

### ⚠️ Security First
**Never commit `.env` files to git!** Copy from the example templates:

```bash
# Copy and customize for local development
cp .env.example .env.local

# Generate secure secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
```

### Local Development (.env.local)
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/rustic_roots"
NEXTAUTH_SECRET="your-generated-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Docker Environments (.env)
```bash
POSTGRES_PASSWORD="your-secure-database-password"
NEXTAUTH_SECRET="your-secure-secret-key"
```

📖 **See [SECURITY.md](SECURITY.md) for complete security guidelines**

## SSL Certificate Setup

### For Local HTTPS Testing
1. **Install mkcert**:
   ```bash
   brew install mkcert
   ```

2. **Install CA** (one time):
   ```bash
   sudo mkcert -install
   ```

3. **Start local HTTPS**:
   ```bash
   ./docker-local-https.sh start
   ```

### For Production
1. **Point DNS** to your server:
   ```
   A    therusticroots.com.au     → YOUR_SERVER_IP
   A    www.therusticroots.com.au → YOUR_SERVER_IP
   ```

2. **Get SSL certificate**:
   ```bash
   ./docker-prod-https.sh start
   ```

## Project Structure

```
rustic-roots/
├── src/app/                 # Next.js App Router pages
├── pages/api/              # API routes (Pages Router)
├── src/components/         # Reusable React components
├── src/context/           # React Context providers
├── prisma/                # Database schema and migrations
├── nginx/                 # nginx configurations
├── certbot/               # SSL certificates
├── *.sh                   # Deployment scripts
└── docker-compose.*.yml   # Docker configurations
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get product details

### Promotions
- `GET /api/promotions` - List active promotions
- `POST /api/promotions` - Create promotion (admin)
- `POST /api/promotions/validate` - Validate promotion code

### Orders
- `GET /api/orders` - User order history
- `POST /api/orders` - Create new order

## Database Schema

### Key Models
- **User**: Authentication and profile information
- **Product**: Furniture catalog with images and pricing
- **Order**: Purchase records with items and totals
- **Promotion**: Discount codes with rules and usage tracking
- **OrderItem**: Individual items within orders

## Troubleshooting

### Common Issues

**Database Connection:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgres

# Start PostgreSQL
brew services start postgresql
```

**Port Conflicts:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

**Docker Issues:**
```bash
# Clean up Docker
docker system prune -f

# Rebuild containers
docker-compose down && docker-compose up --build
```

**SSL Certificate Issues:**
```bash
# Check certificate status
openssl x509 -in certbot/conf/live/therusticroots.com.au/fullchain.pem -text -noout

# Renew certificates
./docker-prod-https.sh renew-ssl
```

## Deployment Checklist

### Local Development
- [ ] PostgreSQL running
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set
- [ ] Database seeded

### Production Deployment
- [ ] DNS records pointing to server
- [ ] Domain accessible via HTTP
- [ ] SSL certificates obtained
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL auto-renewal configured

## Contributing

1. Use the local development environment for coding
2. Test with Docker local HTTPS before production
3. Follow TypeScript strict mode requirements
4. Run `npm run lint` and `npm run typecheck` before commits
5. Test all promotion features with the provided test codes

## Support

For issues or questions:
- Check the troubleshooting section above
- Review container logs: `./docker-local-http.sh logs`
- Verify environment configuration
- Test with different promotion codes