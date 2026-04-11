const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/database');

// Get all services (haircut, beard)
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM services');
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;