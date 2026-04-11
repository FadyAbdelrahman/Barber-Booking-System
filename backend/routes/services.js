const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   GET /api/services
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services WHERE active = 1 ORDER BY price ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
});

// @route   GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Error fetching service' });
  }
});

// @route   POST /api/services  (admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, duration, image_url } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ success: false, message: 'Name, price, and duration are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO services (name, description, price, duration, image_url, active) VALUES (?, ?, ?, ?, ?, 1)',
      [name, description || null, price, duration, image_url || null]
    );

    res.status(201).json({ success: true, message: 'Service created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Error creating service' });
  }
});

// @route   PUT /api/services/:id  (admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, duration, image_url, active } = req.body;

    const [result] = await pool.query(
      `UPDATE services SET name = ?, description = ?, price = ?, duration = ?, image_url = ?, active = ? WHERE id = ?`,
      [name, description, price, duration, image_url, active, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
});

// @route   DELETE /api/services/:id  (admin — soft delete)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE services SET active = 0 WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service deactivated successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Error deactivating service' });
  }
});

module.exports = router;
