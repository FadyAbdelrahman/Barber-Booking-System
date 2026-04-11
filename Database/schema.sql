-- Barber Booking System Database Schema
-- SQL Server Version - Converted from MySQL
-- Created: 2026-03-31

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'barber_booking_system1')
BEGIN
    CREATE DATABASE barber_booking_system1;
END
GO

USE barber_booking_system1;
GO

-- Table 1: Users
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) UNIQUE NOT NULL,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        role NVARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_email ON users(email);
    CREATE INDEX idx_username ON users(username);
    CREATE INDEX idx_role ON users(role);
END
GO

-- Table 2: Barbers
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'barbers')
BEGIN
    CREATE TABLE barbers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        specialty NVARCHAR(100),
        experience_years INT DEFAULT 0,
        bio NVARCHAR(MAX),
        image_url NVARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0.00,
        available BIT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_available ON barbers(available);
    CREATE INDEX idx_rating ON barbers(rating);
END
GO

-- Table 3: Services
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'services')
BEGIN
    CREATE TABLE services (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX),
        price DECIMAL(10,2) NOT NULL,
        duration INT NOT NULL,
        image_url NVARCHAR(255),
        active BIT DEFAULT 1,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX idx_active ON services(active);
    CREATE INDEX idx_price ON services(price);
END
GO

-- Table 4: Appointments
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'appointments')
BEGIN
    CREATE TABLE appointments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        barber_id INT NOT NULL,
        service_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        notes NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_user_id ON appointments(user_id);
    CREATE INDEX idx_barber_id ON appointments(barber_id);
    CREATE INDEX idx_appointment_date ON appointments(appointment_date);
    CREATE INDEX idx_status ON appointments(status);
END
GO

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert Test Users
-- Password: $barber@dbs
INSERT INTO users (username, name, email, password, phone, role) VALUES
('admin', 'System Admin', 'admin@barber.com', '$barber@dbs', '0851234567', 'admin'),
('johndoe', 'John Doe', 'john@example.com', '$barber@dbs', '0851234568', 'customer'),
('maryjane', 'Mary Jane', 'mary@example.com', '$barber@dbs', '0851234569', 'customer');
GO

-- Insert Sample Barbers
INSERT INTO barbers (name, specialty, experience_years, bio, image_url, rating, available) VALUES
('John Smith', 'Classic Cuts', 8, 'Specialist in traditional and modern haircuts with 8 years of experience.', NULL, 4.8, 1),
('Mike Johnson', 'Beard Styling', 5, 'Expert in beard grooming and styling techniques.', NULL, 4.6, 1),
('David Brown', 'Hair Coloring', 10, 'Professional hair colorist with extensive experience in modern techniques.', NULL, 4.9, 1),
('Robert Wilson', 'Kids Haircuts', 6, 'Patient and friendly barber specializing in children''s haircuts.', NULL, 4.7, 1);
GO

-- Insert Sample Services 
INSERT INTO services (name, description, price, duration, image_url, active) VALUES
('Classic Haircut', 'Traditional scissor cut with styling', 25.00, 30, NULL, 1),
('Beard Trim', 'Professional beard shaping and trimming', 15.00, 20, NULL, 1),
('Hair & Beard Combo', 'Complete grooming package', 35.00, 45, NULL, 1),
('Kids Haircut', 'Haircut for children under 12', 20.00, 25, NULL, 1),
('Hair Coloring', 'Professional hair coloring service', 50.00, 90, NULL, 1),
('Hot Towel Shave', 'Traditional hot towel straight razor shave', 30.00, 40, NULL, 1),
('Buzz Cut', 'Quick clipper cut', 18.00, 15, NULL, 1),
('Deluxe Package', 'Haircut, beard trim, and hot towel treatment', 55.00, 60, NULL, 1);
GO

-- Insert Sample Appointments
INSERT INTO appointments (user_id, barber_id, service_id, appointment_date, appointment_time, status, notes) VALUES
(2, 1, 1, '2026-04-15', '10:00:00', 'confirmed', 'First time customer'),
(3, 2, 3, '2026-04-15', '14:30:00', 'pending', 'Requested specific beard style');
GO


-- Verification Queries
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM users
UNION ALL
SELECT 'Barbers', COUNT(*) FROM barbers
UNION ALL
SELECT 'Services', COUNT(*) FROM services
UNION ALL
SELECT 'Appointments', COUNT(*) FROM appointments;
GO

--- Test 1: User Display

USE barber_booking_system1;
GO

SELECT * FROM users;

---Test 2: Barbershop Show

SELECT id, name, specialty, experience_years, rating, available 
FROM barbers;

---Test 3: Presenting services with prices
SELECT id, name, price, duration 
FROM services 
ORDER BY price;


--- Test 4: View Appointments (JOIN Test)
SELECT 
    a.id,
    u.username AS Customer,
    b.name AS Barber,
    s.name AS Service,
    a.appointment_date AS Date,
    a.appointment_time AS Time,
    a.status AS Status
FROM appointments a
JOIN users u ON a.user_id = u.id
JOIN barbers b ON a.barber_id = b.id
JOIN services s ON a.service_id = s.id;

---Test 5: Foreign Keys (Relationships) Test
DELETE FROM users WHERE username = 'johndoe';
GO
SELECT * FROM appointments;