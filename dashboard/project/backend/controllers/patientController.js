// /backend/controllers/patientController.js
const MedicalRecord = require('../models/MedicalRecord');
const pdfKit = require('pdfkit');
const fs = require('fs');

// Patient: View their medical records
exports.getPatientRecords = async (req, res) => {
    try {
        const patientId = req.user.id;  // Use the user ID from the JWT token
        const records = await MedicalRecord.find({ patientId }).populate('patientId', 'username'); // Populate patient details
        res.json(records);
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};

// Get Active Prescriptions
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.user._id;
        const prescriptions = await Prescription.find({ patientId });
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get Allergies
exports.getPatientAllergies = async (req, res) => {
    try {
        const patientId = req.user._id;
        const allergies = await Allergy.find({ patientId });
        res.json(allergies);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id).populate('patientId', 'username');
        if (!record) {
            return res.status(404).json({ msg: 'Record not found' });
        }

        const doc = new pdfKit();
        const filePath = `./pdfs/${record.patientId.username}_Report.pdf`;

        // Create PDF content
        doc.pipe(fs.createWriteStream(filePath));
        doc.text(`Medical Report for ${record.patientId.username}`);
        doc.text(`Date of Visit: ${new Date(record.dateOfVisit).toLocaleDateString()}`);
        doc.text(`Reason for Visit: ${record.reasonForVisit}`);
        doc.text(`Hospital: ${record.hospital}`);
        doc.text(`Attending Doctor: ${record.attendingDoctor}`);
        doc.text(`Diagnosis: ${record.diagnosis}`);
        doc.end();

        // After the PDF is generated, send it as a response
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error downloading the PDF:", err);
                res.status(500).send("Error downloading the PDF.");
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};