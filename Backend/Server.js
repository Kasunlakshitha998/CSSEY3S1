const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoConnection = require('./util/MongoConnection');
const billRoutes = require('./routes/MedicalBillRouter');
const appointmentRoutes = require('./routes/AppointmentRouter');
const actualAppointmentsRouter = require('./routes/actualAppointmentsRouter');
const doctorAvailability = require('./routes/doctorAvailabilityRouter');
const chatRoutes = require('./routes/ChatRouter');
const path = require('path');
const chatPatientRoutes = require('./routes/chatPatients');
const userRoutes = require('./routes/userRout');
const paymentHistoryRoutes = require('./routes/paymentHistoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Load environment variables from .env
dotenv.config();

// Middleware setup
const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Connect to MongoDB
(async () => {
  try {
    await mongoConnection.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
})();

// Use routes
app.use('/appointments', appointmentRoutes);
app.use('/actual-appointments', actualAppointmentsRouter);
app.use('/bills', billRoutes);
app.use('/doctor-availability', doctorAvailability);
app.use('/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/chatPatients', chatPatientRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentHistoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// Base route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app; // Export app for use in test and start scripts
