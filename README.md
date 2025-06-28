# Rustic Roots - Custom Wood Furniture E-Commerce Platform

A full-stack e-commerce platform for handcrafted wooden furniture, built with modern web technologies and designed for scalability, security, and user experience.

## 🌟 Features

### Customer Features
- **Product Catalog**: Browse handcrafted furniture with filtering and sorting
- **Shopping Cart**: Persistent cart with animations and real-time updates
- **User Authentication**: Secure registration and login system
- **Order Management**: Track order history and delivery status
- **Profile Management**: Update personal information and preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Product Management**: Create, edit, and manage furniture listings
- **User Management**: Admin dashboard for user administration
- **Order Monitoring**: Track and manage customer orders
- **Role-based Access**: Secure admin-only functionality

### Static Pages
- **Company Information**: About, Contact, FAQ pages
- **Customer Support**: Returns, Warranty, Care Instructions
- **Shipping Information**: Policies and delivery details

## 🚀 Tech Stack

### Frontend
- **Next.js 15** with App Router and Turbopack
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Context API** for state management

### Backend
- **Next.js API Routes** (Pages Router)
- **Prisma ORM** with PostgreSQL
- **NextAuth.js** for authentication
- **JWT** for session management

### Development Tools
- **TypeScript** with strict mode
- **ESLint** for code quality
- **Prisma Studio** for database management
- **Hot reload** for development

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RusticRoots/rustic-roots
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration:
DATABASE_URL="postgresql://username:password@localhost:5432/rustic_roots"
NEXTAUTH_SECRET="your-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Create database (if not exists)
createdb rustic_roots

# Push schema to database
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
rustic-roots/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── about/             # Company information
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Order placement
│   │   ├── contact/           # Contact form
│   │   ├── orders/            # Order history
│   │   ├── products/          # Product catalog
│   │   ├── profile/           # User profile
│   │   └── [static-pages]/    # FAQ, Returns, etc.
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # Navigation header
│   │   └── ProductCard.tsx    # Product display
│   └── context/               # React Context providers
│       └── CartContext.tsx    # Shopping cart state
├── pages/api/                 # API endpoints
│   ├── auth/                  # Authentication APIs
│   ├── products/              # Product management
│   └── users/                 # User management
├── prisma/                    # Database schema & migrations
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Sample data
├── public/                    # Static assets
├── docs/                      # Documentation
└── [config files]            # Next.js, TypeScript, etc.
```

## 🗄️ Database Schema

### Core Models

**User**
- Authentication and profile information
- Role-based access control (USER/ADMIN)
- Order history relationship

**Product**
- Furniture details and pricing
- Category and stock management
- Image handling and descriptions

**Order & OrderItem**
- Order tracking and status
- Line items with quantities
- Shipping address information

### Key Relationships
- Users can have multiple Orders
- Orders contain multiple OrderItems
- Products can appear in multiple OrderItems
- Users can own Products (for admin users)

## 🔐 Authentication & Security

### Authentication Flow
1. Users register/login through NextAuth.js
2. JWT tokens manage session state
3. Role-based access control for admin features
4. Protected routes redirect unauthenticated users

### Security Features
- **Input Validation**: TypeScript and runtime validation
- **SQL Injection Protection**: Prisma ORM parameterization
- **XSS Prevention**: React's built-in escaping
- **CSRF Protection**: NextAuth.js built-in protection
- **Environment Variables**: Secure configuration management

## 🧪 Testing

### Manual Testing
Comprehensive testing checklists for:
- Authentication flows
- Shopping cart functionality
- Admin operations
- Responsive design
- Performance metrics

### Test Categories
- **Unit Testing**: Component and function testing
- **Integration Testing**: API and database testing
- **Security Testing**: Authentication and input validation
- **Performance Testing**: Core Web Vitals and load testing

See [docs/systemPatterns.md](docs/systemPatterns.md) for detailed testing procedures.

## 📚 Development Guide

### Common Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript checking

# Database
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma migrate dev # Create migration
```

### Code Patterns
- **Components**: PascalCase naming
- **Pages**: App Router structure
- **APIs**: RESTful conventions
- **State**: Context API for global state
- **Forms**: Controlled components with validation

### Development Workflow
1. Create feature branch
2. Implement changes
3. Run tests and linting
4. Create pull request
5. Review and merge

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Performance optimization enabled
- [ ] Monitoring and logging setup

### Environment Variables (Production)
```bash
DATABASE_URL="postgresql://prod_user:password@host:5432/rustic_roots"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Performance Optimizations
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: App Router automatic splitting
- **Static Generation**: Pre-rendered pages
- **Database Indexing**: Optimized queries

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete architecture and development guide
- **[docs/systemPatterns.md](docs/systemPatterns.md)** - Coding patterns and testing procedures
- **[API Documentation](#)** - REST API endpoint reference
- **[Component Library](#)** - Reusable component documentation

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Standards
- Follow TypeScript strict mode
- Use ESLint configuration
- Write comprehensive tests
- Document new features
- Follow existing code patterns

### Code Review Process
- All changes require review
- Tests must pass
- Documentation must be updated
- Security considerations reviewed

## 🔧 Troubleshooting

### Common Issues

**Database Connection**
```bash
# Check database URL format
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

**Authentication Issues**
```bash
# Verify NextAuth secret
echo $NEXTAUTH_SECRET

# Check session configuration
```

**Build Errors**
```bash
# Run linting
npm run lint

# Check TypeScript
npm run typecheck

# Clear Next.js cache
rm -rf .next
```

### Debug Mode
```bash
# Enable debug logging
npm run dev -- --debug

# Database query logging
# Add to schema.prisma:
# generator client {
#   provider = "prisma-client-js"
#   log      = ["query", "info", "warn", "error"]
# }
```

## 📊 Performance Monitoring

### Metrics to Track
- **Core Web Vitals**: LCP, FID, CLS
- **Load Times**: Page render performance
- **Database Queries**: Query optimization
- **Error Rates**: Application stability

### Tools
- **Next.js Analytics**: Built-in performance monitoring
- **Prisma Insights**: Database query analysis
- **Browser DevTools**: Client-side debugging
- **Server Logs**: Application monitoring

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Core e-commerce functionality
- [x] User authentication and profiles
- [x] Admin dashboard
- [x] Responsive design
- [x] Static informational pages

### Phase 2 (Planned)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Inventory management

### Phase 3 (Future)
- [ ] Multi-vendor support
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] AI-powered recommendations
- [ ] Internationalization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Documentation**: Check [CLAUDE.md](CLAUDE.md) and [docs/](docs/) folder
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Contributing**: See contributing guidelines above

### Contact Information
- **Developer**: Claude Code Assistant
- **Repository**: [GitHub Repository URL]
- **Documentation**: [Documentation URL]

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**# RusticRoots
# RusticRoots
