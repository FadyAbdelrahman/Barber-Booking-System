const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// ======================
// 1. Get all user appointments (My Appointments)
// ======================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT 
          a.id, 
          a.appointment_date, 
          a.appointment_time, 
          a.status, 
          a.notes,
          a.created_at,
          b.name as barber_name, 
          b.specialty,
          s.name as service_name, 
          s.price, 
          s.duration
        FROM appointments a
        JOIN barbers b ON a.barber_id = b.id
        JOIN services s ON a.service_id = s.id
        WHERE a.user_id = @userId
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
});

// ======================
// 2. Create new appointment (Book Appointment)
// ======================
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { barber_id, service_id, appointment_date, appointment_time, notes } = req.body;
    const pool = await poolPromise;

    // Check for appointment conflicts
    const conflict = await pool.request()
      .input('barberId', sql.Int, barber_id)
      .input('date', sql.Date, appointment_date)
      .input('time', sql.VarChar, appointment_time)
      .query(`
        SELECT id FROM appointments 
        WHERE barber_id = @barberId 
          AND appointment_date = @date 
          AND appointment_time = @time 
          AND status != 'cancelled'
      `);

    if (conflict.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked' 
      });
    }

    // Create the appointment (insert into database)
    await pool.request()
      .input('userId', sql.Int, req.user.id)
      .input('barberId', sql.Int, barber_id)
      .input('serviceId', sql.Int, service_id)
      .input('date', sql.Date, appointment_date)
      .input('time', sql.VarChar, appointment_time)
      .input('notes', sql.NVarChar, notes || null)
      .query(`
        INSERT INTO appointments 
          (user_id, barber_id, service_id, appointment_date, appointment_time, notes, status)
        VALUES 
          (@userId, @barberId, @serviceId, @date, @time, @notes, 'pending')
      `);

    res.status(201).json({ 
      success: true, 
      message: 'Appointment booked successfully' 
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: 'Error creating appointment' });
  }
});

// ======================
//Cancel appointment (CANCEL)
// ======================
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('userId', sql.Int, req.user.id)
      .query(`
        UPDATE appointments 
        SET status = 'cancelled',
            updated_at = GETDATE()
        WHERE id = @id 
          AND user_id = @userId
          AND status != 'cancelled'
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found or already cancelled' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Appointment cancelled successfully' 
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: 'Error cancelling appointment' });
  }
});

module.exports = router;