const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   GET /api/barbers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM barbers WHERE available = 1 ORDER BY rating DESC'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Get barbers error:', error);
    res.status(500).json({ success: false, message: 'Error fetching barbers' });
  }
});

// @route   GET /api/barbers/all  (admin — includes unavailable)
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM barbers ORDER BY id ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Get all barbers error:', error);
    res.status(500).json({ success: false, message: 'Error fetching barbers' });
  }
});

// @route   GET /api/barbers/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM barbers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get barber error:', error);
    res.status(500).json({ success: false, message: 'Error fetching barber' });
  }
});

// @route   POST /api/barbers  (admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, specialty, experience_years, bio, image_url, rating } = req.body;
    if (!name || !specialty) {
      return res.status(400).json({ success: false, message: 'Name and specialty are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO barbers (name, specialty, experience_years, bio, image_url, rating, available) VALUES (?, ?, ?, ?, ?, ?, 1)',
      [name, specialty, experience_years || 0, bio || null, image_url || null, rating || 0]
    );

    res.status(201).json({ success: true, message: 'Barber created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create barber error:', error);
    res.status(500).json({ success: false, message: 'Error creating barber' });
  }
});

// @route   PUT /api/barbers/:id  (admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, specialty, experience_years, bio, image_url, rating, available } = req.body;

    const [result] = await pool.query(
      `UPDATE barbers
       SET name = ?, specialty = ?, experience_years = ?, bio = ?, image_url = ?, rating = ?, available = ?
       WHERE id = ?`,
      [name, specialty, experience_years, bio, image_url, rating, available, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    res.json({ success: true, message: 'Barber updated successfully' });
  } catch (error) {
    console.error('Update barber error:', error);
    res.status(500).json({ success: false, message: 'Error updating barber' });
  }
});

// @route   DELETE /api/barbers/:id  (admin — soft delete)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE barbers SET available = 0 WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    res.json({ success: true, message: 'Barber deactivated successfully' });
  } catch (error) {
    console.error('Delete barber error:', error);
    res.status(500).json({ success: false, message: 'Error deactivating barber' });
  }
});

module.exports = router;
