const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   GET /api/appointments  (authenticated user — own bookings)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
         b.name  AS barber_name,  b.specialty,
         s.name  AS service_name, s.price, s.duration
       FROM appointments a
       JOIN barbers  b ON a.barber_id  = b.id
       JOIN services s ON a.service_id = s.id
       WHERE a.user_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.id]
    );

    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
});

// @route   GET /api/appointments/all  (admin — all bookings)
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         a.id, a.appointment_date, a.appointment_time, a.status, a.notes, a.created_at,
         u.username, u.name AS customer_name, u.email,
         b.name  AS barber_name,
         s.name  AS service_name, s.price
       FROM appointments a
       JOIN users    u ON a.user_id    = u.id
       JOIN barbers  b ON a.barber_id  = b.id
       JOIN services s ON a.service_id = s.id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    );

    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
});

// @route   POST /api/appointments  (authenticated user)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { barber_id, service_id, appointment_date, appointment_time, notes } = req.body;

    // Check for conflicting slot
    const [conflict] = await pool.query(
      `SELECT id FROM appointments
       WHERE barber_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'`,
      [barber_id, appointment_date, appointment_time]
    );

    if (conflict.length > 0) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    await pool.query(
      `INSERT INTO appointments (user_id, barber_id, service_id, appointment_date, appointment_time, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, barber_id, service_id, appointment_date, appointment_time, notes || null]
    );

    res.status(201).json({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: 'Error creating appointment' });
  }
});

// @route   PUT /api/appointments/:id/cancel  (authenticated user)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      `UPDATE appointments
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = ? AND user_id = ? AND status != 'cancelled'`,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found or already cancelled' });
    }

    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: 'Error cancelling appointment' });
  }
});

// @route   PUT /api/appointments/:id/status  (admin — update status)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const [result] = await pool.query(
      `UPDATE appointments SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Error updating appointment' });
  }
});

module.exports = router;
