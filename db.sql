-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'manager');

-- Create users table with role management
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    encrypted_password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Insert sample admin and manager users for malabarecosolutions.com
INSERT INTO users (email, encrypted_password, role, full_name) VALUES
('admin@malabarecosolutions.com', '$2b$10$RXNa1dO8Z9BkfhWMAinyAuk4fnJzrhvtjnA9OZqBdISUETDnFcyne', 'admin', 'Admin User'),
('manager@malabarecosolutions.com', '$2b$10$RXNa1dO8Z9BkfhWMAinyAuk4fnJzrhvtjnA9OZqBdISUETDnFcyne', 'manager', 'Manager User');



