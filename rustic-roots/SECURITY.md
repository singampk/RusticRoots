# Security Guidelines

## 🚨 CRITICAL: Secrets Management

### ✅ What's Protected (in .gitignore)
- Environment variables (`.env*` files)
- SSL certificates and private keys (`*.pem`, `*.key`, `*.crt`)
- Database files and volumes
- Docker secrets and logs
- AWS credentials
- Let's Encrypt certificates

### ⚠️ What to Never Commit
- Real passwords or API keys
- Production environment variables
- SSL private keys
- Database credentials
- AWS access keys
- JWT secrets

### 🔧 Setup Instructions

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate secure secrets:**
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate database password
   openssl rand -base64 16
   ```

3. **Update .env.local with real values:**
   ```bash
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/rustic_roots"
   NEXTAUTH_SECRET="your-generated-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 🧪 Test Accounts (Development Only)

The seed script creates test accounts with known passwords for development:

- **Admin**: admin@therusticroots.com.au / password123
- **User**: john@example.com / password123

**⚠️ IMPORTANT**: Change these in production!

### 🔒 Production Security Checklist

- [ ] Generate unique NEXTAUTH_SECRET (minimum 32 characters)
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS in production
- [ ] Set up proper firewall rules
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (configured in nginx)
- [ ] Regular security updates
- [ ] Monitor access logs

### 📁 File Security

**Protected by .gitignore:**
```
.env*                    # All environment files
*.pem, *.key, *.crt     # SSL certificates
certbot/                # Let's Encrypt data
nginx/ssl/              # Local SSL certificates
postgres_data*/         # Database volumes
```

### 🐳 Docker Security

- Database passwords via environment variables
- SSL certificates mounted as read-only volumes
- Internal networks for database communication
- Health checks for service monitoring

### 🛡️ Application Security Features

- **Authentication**: NextAuth.js with JWT
- **Authorization**: Role-based access (ADMIN/USER)
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Configured in nginx
- **HTTPS**: Full SSL/TLS encryption
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Input Validation**: TypeScript + Prisma validation

### 🚨 If Credentials are Compromised

1. **Immediately rotate all affected credentials**
2. **Check git history for exposed secrets**
3. **Revoke and regenerate API keys**
4. **Update all deployment environments**
5. **Monitor for unauthorized access**

### 📞 Reporting Security Issues

For security vulnerabilities, create an issue or contact the development team directly.

**DO NOT** commit fixes for security issues to public repositories without proper review.