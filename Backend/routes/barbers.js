const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/database'); // Database configuration modified for MSSQL (SQL Server)
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   GET /api/barbers
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;

    // SQL Server uses 1 for TRUE (bit datatype)
    const result = await pool.request()
      .query('SELECT * FROM barbers WHERE available = 1 ORDER BY rating DESC');

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });
  } catch (error) {
    console.error('Get barbers error:', error);
    res.status(500).json({ success: false, message: 'Error fetching barbers' });
  }
});

// @route   GET /api/barbers/:id
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM barbers WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Get barber error:', error);
    res.status(500).json({ success: false, message: 'Error fetching barber' });
  }
});

// @route   POST /api/barbers
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, specialty, experience_years, bio, image_url, rating } = req.body;
    if (!name || !specialty) {
      return res.status(400).json({ success: false, message: 'Name and specialty are required' });
    }

    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('specialty', sql.NVarChar, specialty)
      .input('exp', sql.Int, experience_years || 0)
      .input('bio', sql.NVarChar, bio)
      .input('img', sql.NVarChar, image_url)
      .input('rating', sql.Decimal(3, 2), rating || 0)
      .query('INSERT INTO barbers (name, specialty, experience_years, bio, image_url, rating, available) VALUES (@name, @specialty, @exp, @bio, @img, @rating, 1)');

    res.status(201).json({ success: true, message: 'Barber created successfully' });
  } catch (error) {
    console.error('Create barber error:', error);
    res.status(500).json({ success: false, message: 'Error creating barber' });
  }
});

// @route   PUT /api/barbers/:id
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, specialty, experience_years, bio, image_url, rating, available } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.NVarChar, name)
      .input('spec', sql.NVarChar, specialty)
      .input('exp', sql.Int, experience_years)
      .input('bio', sql.NVarChar, bio)
      .input('img', sql.NVarChar, image_url)
      .input('rating', sql.Decimal(3,2), rating)
      .input('avail', sql.Bit, available) // SQL Server uses Bit instead of Boolean
      .query(`UPDATE barbers SET name = @name, specialty = @spec, experience_years = @exp, 
              bio = @bio, image_url = @img, rating = @rating, available = @avail WHERE id = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    res.json({ success: true, message: 'Barber updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Error updating barber' });
  }
});

// @route   DELETE /api/barbers/:id
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('UPDATE barbers SET available = 0 WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: 'Barber not found' });
    }

    res.json({ success: true, message: 'Barber deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting barber' });
  }
});

module.exports = router;