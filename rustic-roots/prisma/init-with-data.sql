-- Enhanced database initialization with sample data
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE rustic_roots TO rustic_admin;

-- Connect to the rustic_roots database
\c rustic_roots;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO rustic_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rustic_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rustic_admin;

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "shippingAddress" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Insert sample users
INSERT INTO "User" ("id", "name", "email", "password", "role") VALUES
('admin-user-id', 'Admin User', 'admin@therusticroots.com.au', '$2a$10$8K9Rz3H5x7Qm1N2P4V6W8u.J5L7M9O1Q3R5T7U9V1X3Z5A7B9C1D3E', 'ADMIN'),
('customer-user-id', 'John Smith', 'john@example.com', '$2a$10$8K9Rz3H5x7Qm1N2P4V6W8u.J5L7M9O1Q3R5T7U9V1X3Z5A7B9C1D3E', 'USER')
ON CONFLICT ("email") DO NOTHING;

-- Insert sample products
INSERT INTO "Product" ("id", "name", "description", "price", "images", "category", "stock", "ownerId") VALUES
('product-1', 'Reclaimed Wood Console Table', 'Unique console table made from reclaimed barn wood. Each piece tells a story with its weathered character and natural patina.', 899.00, ARRAY['/images/console-table.jpg'], 'Tables', 5, 'admin-user-id'),
('product-2', 'Live Edge Dining Table', 'Stunning live edge dining table featuring natural wood grain and organic curves. Perfect centerpiece for any dining room.', 1299.00, ARRAY['/images/dining-table.jpg'], 'Tables', 3, 'admin-user-id'),
('product-3', 'Rustic Oak Bookshelf', 'Handcrafted oak bookshelf with adjustable shelves. Built to last generations with traditional joinery techniques.', 649.00, ARRAY['/images/bookshelf.jpg'], 'Storage', 8, 'admin-user-id'),
('product-4', 'Farmhouse Coffee Table', 'Charming farmhouse-style coffee table with distressed finish. Features hidden storage compartment.', 449.00, ARRAY['/images/coffee-table.jpg'], 'Tables', 12, 'admin-user-id'),
('product-5', 'Custom Kitchen Island', 'Bespoke kitchen island crafted from solid hardwood. Includes built-in storage and butcher block top.', 1899.00, ARRAY['/images/kitchen-island.jpg'], 'Kitchen', 2, 'admin-user-id'),
('product-6', 'Wooden Bar Stools', 'Set of 2 handmade bar stools with comfortable curved seats. Perfect complement to any kitchen island.', 349.00, ARRAY['/images/bar-stools.jpg'], 'Seating', 15, 'admin-user-id'),
('product-7', 'Rustic Bed Frame', 'Queen size bed frame made from reclaimed timber. Features sturdy construction and natural wood finish.', 799.00, ARRAY['/images/bed-frame.jpg'], 'Bedroom', 4, 'admin-user-id'),
('product-8', 'Floating Shelves Set', 'Set of 3 floating shelves made from solid oak. Minimalist design perfect for modern homes.', 199.00, ARRAY['/images/floating-shelves.jpg'], 'Storage', 25, 'admin-user-id'),
('product-9', 'Garden Bench', 'Weather-resistant outdoor bench crafted from treated hardwood. Ideal for patios and gardens.', 299.00, ARRAY['/images/garden-bench.jpg'], 'Outdoor', 10, 'admin-user-id'),
('product-10', 'Custom Wardrobe', 'Full-height wardrobe with sliding doors and internal organization system. Made to measure for your space.', 2299.00, ARRAY['/images/wardrobe.jpg'], 'Bedroom', 1, 'admin-user-id')
ON CONFLICT ("id") DO NOTHING;

-- Insert sample orders
INSERT INTO "Order" ("id", "orderNumber", "userId", "total", "status", "shippingAddress") VALUES
('order-1', 'RR-2025-001', 'customer-user-id', 899.00, 'COMPLETED', '{"name": "John Smith", "address": "123 Main St", "city": "Sydney", "state": "NSW", "postcode": "2000", "country": "Australia"}'),
('order-2', 'RR-2025-002', 'customer-user-id', 648.00, 'SHIPPED', '{"name": "John Smith", "address": "123 Main St", "city": "Sydney", "state": "NSW", "postcode": "2000", "country": "Australia"}')
ON CONFLICT ("orderNumber") DO NOTHING;

-- Insert sample order items
INSERT INTO "OrderItem" ("id", "orderId", "productId", "quantity", "price") VALUES
('order-item-1', 'order-1', 'product-1', 1, 899.00),
('order-item-2', 'order-2', 'product-6', 2, 349.00)
ON CONFLICT ("id") DO NOTHING;

-- Update table permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rustic_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rustic_admin;