USE barber_booking_system1;
GO

-- Test 1: Show last appointment
SELECT TOP 1 * FROM appointments ORDER BY id DESC;

-- Test 2: Show full appointment details with JOIN
SELECT 
    a.id,
    u.username,
    u.name AS customer,
    b.name AS barber,
    s.name AS service,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.notes,
    a.created_at
FROM appointments a
JOIN users u ON a.user_id = u.id
JOIN barbers b ON a.barber_id = b.id
JOIN services s ON a.service_id = s.id
ORDER BY a.id DESC;
GO

-- Test 3: Count total records
SELECT 
    'Users' AS TableName, 
    COUNT(*) AS TotalRecords 
FROM users

UNION ALL

SELECT 'Barbers', COUNT(*) FROM barbers

UNION ALL

SELECT 'Services', COUNT(*) FROM services

UNION ALL

SELECT 'Appointments', COUNT(*) FROM appointments;
GO