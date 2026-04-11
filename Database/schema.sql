-- ============================================================
-- Sharp Society — Barber Booking System
-- MySQL Schema  |  B8IT146 CA  |  Dublin Business School
-- ============================================================

CREATE DATABASE IF NOT EXISTS barber_booking
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barber_booking;

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         INT           NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)   NOT NULL,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  phone      VARCHAR(20)   DEFAULT NULL,
  role       ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_username (username),
  UNIQUE KEY uq_email    (email),
  INDEX idx_role (role)
);

-- ============================================================
-- TABLE 2: barbers
-- ============================================================
CREATE TABLE IF NOT EXISTS barbers (
  id               INT           NOT NULL AUTO_INCREMENT,
  name             VARCHAR(100)  NOT NULL,
  specialty        VARCHAR(100)  DEFAULT NULL,
  experience_years INT           NOT NULL DEFAULT 0,
  bio              TEXT          DEFAULT NULL,
  image_url        VARCHAR(255)  DEFAULT NULL,
  rating           DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  available        TINYINT(1)    NOT NULL DEFAULT 1,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_available (available),
  INDEX idx_rating    (rating)
);

-- ============================================================
-- TABLE 3: services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  description TEXT          DEFAULT NULL,
  price       DECIMAL(10,2) NOT NULL,
  duration    INT           NOT NULL COMMENT 'Duration in minutes',
  image_url   VARCHAR(255)  DEFAULT NULL,
  active      TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_active (active),
  INDEX idx_price  (price)
);

-- ============================================================
-- TABLE 4: appointments
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id               INT      NOT NULL AUTO_INCREMENT,
  user_id          INT      NOT NULL,
  barber_id        INT      NOT NULL,
  service_id       INT      NOT NULL,
  appointment_date DATE     NOT NULL,
  appointment_time TIME     NOT NULL,
  status           ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  notes            TEXT     DEFAULT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_appt_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_appt_barber  FOREIGN KEY (barber_id)  REFERENCES barbers(id)  ON DELETE CASCADE,
  CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_user_id          (user_id),
  INDEX idx_barber_id        (barber_id),
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_status           (status)
);

-- ============================================================
-- SAMPLE DATA
-- All passwords are bcrypt hash of: $barber@dbs
-- ============================================================

INSERT INTO users (username, name, email, password, phone, role) VALUES
  ('admin',    'System Admin', 'admin@barber.com',   '$2b$10$JHLIOrxmGLzFm12.YtLBuemSroF3g2LN9NcAswnZhWxqoIacH64s.', '0851234567', 'admin'),
  ('johndoe',  'John Doe',     'john@example.com',   '$2b$10$JHLIOrxmGLzFm12.YtLBuemSroF3g2LN9NcAswnZhWxqoIacH64s.', '0851234568', 'customer'),
  ('maryjane', 'Mary Jane',    'mary@example.com',   '$2b$10$JHLIOrxmGLzFm12.YtLBuemSroF3g2LN9NcAswnZhWxqoIacH64s.', '0851234569', 'customer');

INSERT INTO barbers (name, specialty, experience_years, bio, rating, available) VALUES
  ('John Smith',    'Classic Cuts',    8,  'Specialist in traditional and modern haircuts with 8 years of experience.',  4.8, 1),
  ('Mike Johnson',  'Beard Styling',   5,  'Expert in beard grooming and styling techniques.',                            4.6, 1),
  ('David Brown',   'Hair Colouring',  10, 'Professional hair colourist with extensive experience in modern techniques.', 4.9, 1),
  ('Robert Wilson', 'Kids Haircuts',   6,  'Patient and friendly barber specialising in children\'s haircuts.',           4.7, 1);

INSERT INTO services (name, description, price, duration) VALUES
  ('Classic Haircut',   'Traditional scissor cut with styling',           25.00, 30),
  ('Beard Trim',        'Professional beard shaping and trimming',         15.00, 20),
  ('Hair & Beard Combo','Complete grooming package',                       35.00, 45),
  ('Kids Haircut',      'Haircut for children under 12',                   20.00, 25),
  ('Hair Colouring',    'Professional hair colouring service',             50.00, 90),
  ('Hot Towel Shave',   'Traditional hot towel straight razor shave',      30.00, 40),
  ('Buzz Cut',          'Quick clipper cut',                               18.00, 15),
  ('Deluxe Package',    'Haircut, beard trim, and hot towel treatment',    55.00, 60);

INSERT INTO appointments (user_id, barber_id, service_id, appointment_date, appointment_time, status, notes) VALUES
  (2, 1, 1, '2026-04-20', '10:00:00', 'confirmed', 'First time customer'),
  (3, 2, 3, '2026-04-20', '14:30:00', 'pending',   'Requested specific beard style');

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
SELECT 'users'        AS `Table`, COUNT(*) AS `Rows` FROM users
UNION ALL
SELECT 'barbers',     COUNT(*) FROM barbers
UNION ALL
SELECT 'services',    COUNT(*) FROM services
UNION ALL
SELECT 'appointments',COUNT(*) FROM appointments;

-- Test JOIN — view appointments with full context
SELECT
  a.id,
  u.username      AS customer,
  b.name          AS barber,
  s.name          AS service,
  a.appointment_date,
  a.appointment_time,
  a.status
FROM appointments a
JOIN users    u ON a.user_id    = u.id
JOIN barbers  b ON a.barber_id  = b.id
JOIN services s ON a.service_id = s.id;

-- Test foreign-key CASCADE: deleting a user should remove their appointments
-- (Uncomment to verify — do NOT run on production data)
-- DELETE FROM users WHERE username = 'johndoe';
-- SELECT * FROM appointments;
