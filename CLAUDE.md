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

### Development Notes
- Uses PostgreSQL as primary database
- TypeScript with strict mode enabled
- ESLint configuration for Next.js
- Path alias `@/*` maps to `./src/*`
- Hot reload enabled in development
- Automatic TypeScript checking on build