USE barber_booking_system1;
GO

-- Update admin password
UPDATE users 
SET password = '$barber@dbs'
WHERE username = 'admin';
GO

-- Update johndoe password
UPDATE users 
SET password = '$barber@dbs'
WHERE username = 'johndoe';
GO

-- Update maryjane password
UPDATE users 
SET password = '$barber@dbs'
WHERE username = 'maryjane';
GO

-- Verify the changes
SELECT username, password FROM users;
GO