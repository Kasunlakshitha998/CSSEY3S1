// /backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Protecting the admin routes with the auth middleware
router.post('/records', authMiddleware, adminController.addRecord); // Requires authentication
router.get('/records', authMiddleware, adminController.getAllRecords); // Requires authentication
router.get('/report/:id', authMiddleware, adminController.generatePDF); // Requires authentication
router.get('/patients', authMiddleware, adminController.getPatients); // New endpoint to get patients

module.exports = router;
