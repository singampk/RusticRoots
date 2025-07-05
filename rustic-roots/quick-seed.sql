-- Quick seed data for testing
-- Create admin user
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES 
('admin-user-id', 'Admin User', 'admin@therusticroots.com.au', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYCjEb8tXz.4RIm', 'ADMIN', NOW(), NOW()),
('customer-user-id', 'John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYCjEb8tXz.4RIm', 'USER', NOW(), NOW());

-- Create some products
INSERT INTO "Product" (id, name, description, price, images, category, stock, featured, "ownerId", "createdAt", "updatedAt") VALUES 
('prod-1', 'Rustic Oak Dining Table', 'Handcrafted solid oak dining table perfect for family gatherings.', 1299.99, ARRAY['https://files.therusticroots.com.au/images/placeholder-furniture.svg'], 'Tables', 5, true, 'admin-user-id', NOW(), NOW()),
('prod-2', 'Walnut Bookshelf', 'Beautiful walnut bookshelf with adjustable shelves.', 899.99, ARRAY['https://files.therusticroots.com.au/images/placeholder-furniture.svg'], 'Storage', 3, true, 'admin-user-id', NOW(), NOW()),
('prod-3', 'Cedar Chest', 'Aromatic cedar chest for blanket and clothing storage.', 649.99, ARRAY['https://files.therusticroots.com.au/images/placeholder-furniture.svg'], 'Storage', 8, true, 'admin-user-id', NOW(), NOW()),
('prod-4', 'Maple Rocking Chair', 'Comfortable maple rocking chair with cushioned seat.', 499.99, ARRAY['https://files.therusticroots.com.au/images/placeholder-furniture.svg'], 'Chairs', 12, false, 'admin-user-id', NOW(), NOW()),
('prod-5', 'Pine Coffee Table', 'Rustic pine coffee table with lower shelf for storage.', 399.99, ARRAY['https://files.therusticroots.com.au/images/placeholder-furniture.svg'], 'Tables', 7, false, 'admin-user-id', NOW(), NOW());

-- Create some promotions
INSERT INTO "Promotion" (id, name, code, description, type, value, "usageType", "maxUses", "currentUses", "isActive", "startDate", "endDate", "minOrderValue", "maxDiscount", "createdById", "createdAt", "updatedAt") VALUES 
('promo-1', 'Welcome 10% Off', 'WELCOME10', '10% off your first order', 'PERCENTAGE', 10, 'MULTIPLE_USE', 1000, 0, true, NOW(), NOW() + INTERVAL '30 days', 100, 200, 'admin-user-id', NOW(), NOW()),
('promo-2', 'Summer $50 Off', 'SUMMER50', '$50 off orders over $500', 'FIXED_AMOUNT', 50, 'MULTIPLE_USE', 500, 0, true, NOW(), NOW() + INTERVAL '60 days', 500, NULL, 'admin-user-id', NOW(), NOW()),
('promo-3', 'Free Shipping', 'FREESHIP', 'Free shipping on any order', 'FIXED_AMOUNT', 25, 'MULTIPLE_USE', NULL, 0, true, NOW(), NOW() + INTERVAL '90 days', 0, NULL, 'admin-user-id', NOW(), NOW());

-- Create a sample order with promotion
INSERT INTO "Order" (id, total, subtotal, "discountAmount", status, "promotionId", "promotionCode", "promotionSnapshot", "userId", "createdAt", "updatedAt") VALUES 
('order-1', 1169.99, 1299.99, 130.00, 'DELIVERED', 'promo-1', 'WELCOME10', '{"name":"Welcome 10% Off","code":"WELCOME10","type":"PERCENTAGE","value":10,"appliedDiscount":130.00}', 'customer-user-id', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
('order-2', 849.99, 899.99, 50.00, 'WORK_IN_PROGRESS', 'promo-2', 'SUMMER50', '{"name":"Summer $50 Off","code":"SUMMER50","type":"FIXED_AMOUNT","value":50,"appliedDiscount":50.00}', 'customer-user-id', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
('order-3', 649.99, 649.99, 0, 'RECEIVED_ORDER', NULL, NULL, NULL, 'customer-user-id', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Create order items
INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price) VALUES 
('item-1', 'order-1', 'prod-1', 1, 1299.99),
('item-2', 'order-2', 'prod-2', 1, 899.99),
('item-3', 'order-3', 'prod-3', 1, 649.99);