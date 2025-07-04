-- Initialize the database
-- This script runs when the PostgreSQL container starts for the first time

-- Create any additional extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE rustic_roots TO rustic_admin;