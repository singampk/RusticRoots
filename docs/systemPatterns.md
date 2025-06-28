# System Patterns

This file documents recurring patterns and standards used in the Rustic Roots e-commerce platform.

## Coding Patterns

### Component Patterns

#### Page Component Structure
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'

export default function PageName() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Load data
    fetchData()
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page content */}
      </div>
    </div>
  )
}
```

#### API Route Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requireRole } from '@/lib/authMiddleware'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    // Handle GET logic
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN')
    const data = await request.json()
    // Handle POST logic
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}
```

#### Form Component Pattern
```typescript
'use client'

import { useState } from 'react'

interface FormData {
  field1: string
  field2: string
}

export default function FormComponent() {
  const [formData, setFormData] = useState<FormData>({
    field1: '',
    field2: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ field1: '', field2: '' })
      } else {
        const data = await response.json()
        setError(data.error || 'An error occurred')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### State Management Patterns

#### Context Provider Pattern
```typescript
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

interface State {
  items: Item[]
  total: number
}

interface Action {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY'
  payload: any
}

const StateContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

function stateReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM':
      // Handle action
      return { ...state, items: [...state.items, action.payload] }
    default:
      return state
  }
}

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stateReducer, initialState)

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  )
}

export function useStateContext() {
  const context = useContext(StateContext)
  if (!context) {
    throw new Error('useStateContext must be used within StateProvider')
  }
  return context
}
```

#### Loading State Pattern
```typescript
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

// In render
if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-xl">Loading...</div>
    </div>
  )
}

if (error) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  )
}
```

### Animation Patterns

#### Button Animation Pattern
```typescript
const [isLoading, setIsLoading] = useState(false)
const [showSuccess, setShowSuccess] = useState(false)

const handleAction = async () => {
  setIsLoading(true)
  
  try {
    await performAction()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  } finally {
    setIsLoading(false)
  }
}

// In render
<button 
  className={`transition-all duration-300 ${
    showSuccess 
      ? 'bg-green-600 text-white' 
      : isLoading
        ? 'bg-amber-700 text-white scale-95'
        : 'bg-amber-800 text-white hover:bg-amber-900 hover:scale-105'
  }`}
>
  {showSuccess ? 'Success!' : isLoading ? 'Loading...' : 'Action'}
</button>
```

## Architectural Patterns

### Authentication Flow
```
1. User accesses protected route
2. Middleware checks for valid session
3. If no session → redirect to /auth/signin
4. If session exists → check role permissions
5. If authorized → render page
6. If unauthorized → show error/redirect
```

### API Security Pattern
```
1. Extract JWT token from request headers
2. Verify token signature and expiration
3. Decode user information from token
4. Check user role against required permissions
5. Allow/deny access based on authorization
```

### Database Access Pattern
```
1. Use Prisma client for all database operations
2. Validate input data before queries
3. Use transactions for multi-step operations
4. Handle errors gracefully with try-catch
5. Return consistent response format
```

### Error Handling Pattern
```typescript
// API Route Error Handling
try {
  const result = await prisma.model.operation()
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}

// Frontend Error Handling
const [error, setError] = useState('')

try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    throw new Error('Request failed')
  }
  const data = await response.json()
} catch (err) {
  setError(err.message)
}
```

## Testing Patterns

### Manual Testing Procedures

#### Authentication Testing
```
Test Case: User Registration
1. Navigate to /auth/signup
2. Fill form with valid data
3. Submit form
4. Verify success message
5. Check database for new user
6. Verify email uniqueness validation

Test Case: Protected Route Access
1. Clear browser session
2. Navigate to /admin
3. Verify redirect to /auth/signin
4. Sign in with valid credentials
5. Verify redirect back to /admin
6. Verify admin content loads
```

#### Shopping Cart Testing
```
Test Case: Add to Cart Animation
1. Navigate to /products
2. Click "Add to Cart" on any product
3. Verify button shows loading spinner
4. Verify button shows success state
5. Verify cart icon bounces
6. Verify cart count updates

Test Case: Cart Persistence
1. Add items to cart
2. Close browser tab
3. Reopen application
4. Navigate to /cart
5. Verify items are still present
6. Verify quantities are correct
```

#### Responsive Design Testing
```
Test Case: Mobile Navigation
1. Set viewport to mobile size (375px)
2. Navigate to homepage
3. Verify navigation is accessible
4. Test cart functionality
5. Verify form inputs are touch-friendly
6. Test checkout flow on mobile

Test Case: Tablet Layout
1. Set viewport to tablet size (768px)
2. Navigate through all pages
3. Verify layouts adapt correctly
4. Test product grid responsiveness
5. Verify admin dashboard layout
```

#### Admin Functionality Testing
```
Test Case: Product Management
1. Sign in as admin user
2. Navigate to /admin
3. Create new product
4. Verify product appears in listing
5. Edit product details
6. Verify changes are saved
7. Delete product
8. Verify removal from database

Test Case: User Management
1. Access user management section
2. View user list
3. Test role changes
4. Verify permission updates
5. Test user deletion
6. Verify data integrity
```

### Performance Testing

#### Core Web Vitals Testing
```
Test Case: First Contentful Paint (FCP)
1. Clear browser cache
2. Navigate to homepage
3. Measure time to first content render
4. Target: < 1.8 seconds

Test Case: Largest Contentful Paint (LCP)
1. Navigate to product detail page
2. Measure time to largest element render
3. Target: < 2.5 seconds

Test Case: Cumulative Layout Shift (CLS)
1. Navigate through application
2. Measure layout shifts during load
3. Target: < 0.1
```

#### Database Performance Testing
```
Test Case: Product Query Performance
1. Seed database with 1000+ products
2. Test product listing page load time
3. Test search functionality performance
4. Test filtering operations
5. Verify pagination efficiency

Test Case: Cart Operations Performance
1. Add 50+ items to cart
2. Test cart page load time
3. Test quantity update responsiveness
4. Test checkout process speed
```

### Load Testing

#### Concurrent User Testing
```
Test Case: Multiple User Sessions
1. Simulate 10 concurrent users
2. Test authentication system load
3. Test cart operations under load
4. Test database connection pooling
5. Monitor response times
6. Check for race conditions
```

#### Database Stress Testing
```
Test Case: High Volume Operations
1. Simulate bulk product creation
2. Test multiple simultaneous orders
3. Monitor database performance
4. Check connection limits
5. Verify data consistency
6. Test backup and recovery
```

### Security Testing

#### Authentication Security Testing
```
Test Case: JWT Token Validation
1. Test with expired tokens
2. Test with malformed tokens
3. Test with missing tokens
4. Verify proper error responses
5. Test token refresh mechanism

Test Case: Role-Based Access Control
1. Test admin routes with user role
2. Test API endpoints with wrong permissions
3. Verify proper 403 responses
4. Test privilege escalation attempts
```

#### Input Validation Testing
```
Test Case: SQL Injection Prevention
1. Test form inputs with SQL syntax
2. Test API endpoints with malicious payloads
3. Verify Prisma parameterization
4. Test special characters handling

Test Case: XSS Prevention
1. Test form inputs with script tags
2. Test URL parameters with JavaScript
3. Verify proper sanitization
4. Test output encoding
```

### Integration Testing

#### API Integration Testing
```
Test Case: Authentication Flow
1. Register new user via API
2. Sign in via API
3. Access protected endpoint
4. Verify JWT token handling
5. Test token expiration
6. Test refresh token flow

Test Case: E-commerce Flow
1. Create product via API
2. Add to cart via frontend
3. Proceed through checkout
4. Verify order creation
5. Test order status updates
6. Verify email notifications
```

#### Database Integration Testing
```
Test Case: Data Consistency
1. Create user with products
2. Delete user
3. Verify cascade deletion
4. Test foreign key constraints
5. Verify referential integrity

Test Case: Transaction Handling
1. Start complex transaction
2. Simulate failure mid-transaction
3. Verify rollback behavior
4. Test transaction isolation
5. Verify data consistency
```

### Automated Testing Setup

#### Unit Testing Pattern
```typescript
// Example test file: components/__tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  // ... other properties
}

describe('ProductCard', () => {
  test('renders product information', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  test('handles add to cart', () => {
    const mockDispatch = jest.fn()
    render(<ProductCard product={mockProduct} />)
    
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(mockDispatch).toHaveBeenCalled()
  })
})
```

#### API Testing Pattern
```typescript
// Example test file: pages/api/__tests__/products.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '../products'

describe('/api/products', () => {
  test('GET returns products list', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  test('POST requires authentication', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { name: 'Test Product' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(401)
  })
})
```

### Testing Environment Setup

#### Test Database Configuration
```bash
# Test environment variables
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/rustic_roots_test"
NEXTAUTH_SECRET="test_secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### Test Data Seeding
```typescript
// prisma/test-seed.ts
const testProducts = [
  {
    name: 'Test Product 1',
    price: 99.99,
    category: 'Tables',
    stock: 10
  }
  // ... more test data
]

async function seedTestData() {
  await prisma.product.createMany({
    data: testProducts
  })
}
```

### Continuous Integration Testing

#### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - run: npm install
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

This comprehensive testing strategy ensures the Rustic Roots platform maintains high quality, security, and performance standards throughout development and deployment.