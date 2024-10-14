const express = require('express');
const router = express.Router();
const { 
    getPatientRecords, 
    getPatientPrescriptions, 
    getPatientAllergies,
    generatePDF
} = require('../controllers/patientController'); // Destructure to get the functions directly
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

// Route for patients to view their own medical records
router.get('/records', authMiddleware, getPatientRecords); // Use auth middleware

// Get Prescriptions
router.get('/prescriptions', authMiddleware, getPatientPrescriptions); // Use the correct function

// Get Allergies
router.get('/allergies', authMiddleware, getPatientAllergies); // Use the correct function


router.get('/report/:id', authMiddleware, generatePDF);
module.exports = router;
