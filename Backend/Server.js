// Server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoConnection = require('./util/MongoConnection');
const billRoutes = require('./routers/MedicalBillRouter');
const appointmentRoutes = require('./routers/AppointmentRouter');
const actualAppointmentsRouter = require('./routers/actualAppointmentsRouter');
const DoctorAvailability = require('./routers/doctorAvailabilityRouter')
const chatRoutes = require('./routers/ChatRouter');
const path = require('path');
const chatPatientRoutes = require('./routers/chatPatients');

// Load environment variables from .env
dotenv.config();

// Middleware setup
const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

(async () => {
  try {
    await mongoConnection.connect();
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
})();

app.use('/appointments', appointmentRoutes); // Use AppointmentRouter
app.use('/actual-appointments', actualAppointmentsRouter);
app.use('/bills', billRoutes);
app.use('/doctor-availability', DoctorAvailability); // New doctor availability route
app.use('/chat', chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/chatPatients', chatPatientRoutes);

const userRoutes = require('./routers/userRout');
app.use('/user', userRoutes);

// Add a base route to confirm server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
