const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// GET /api/appointments - Get appointments (protected)
// Admin sees all, users see only their own
// Query params: ?status=pending|approved|rejected (optional)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { status } = req.query;
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = 'SELECT * FROM appointments';
        const params = [];
        const conditions = [];

        // Regular users can only see their own appointments
        if (userRole !== 'admin') {
            conditions.push('user_id = ?');
            params.push(userId);
        }

        // Filter by status if provided
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            conditions.push('status = ?');
            params.push(status);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY date DESC, time DESC';

        const [appointments] = await db.query(query, params);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// POST /api/appointments - Create new appointment (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { patient_name, doctor_name, department, date, time } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!patient_name || !doctor_name || !department || !date || !time) {
            return res.status(400).json({
                message: 'All fields are required: patient_name, doctor_name, department, date, time'
            });
        }

        // Insert new appointment
        const [result] = await db.query(
            'INSERT INTO appointments (user_id, patient_name, doctor_name, department, date, time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, patient_name, doctor_name, department, date, time, 'pending']
        );

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment: {
                id: result.insertId,
                user_id: userId,
                patient_name,
                doctor_name,
                department,
                date,
                time,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment' });
    }
});

// PUT /api/appointments/:id - Update appointment status (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be: pending, approved, or rejected'
            });
        }

        // Update appointment status
        const [result] = await db.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({
            message: 'Appointment status updated successfully',
            id,
            status
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Error updating appointment' });
    }
});

module.exports = router;
