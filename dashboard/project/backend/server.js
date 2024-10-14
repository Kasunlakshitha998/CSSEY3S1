// /backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vihanduk:vinu@translatorapp.fssic.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/user', userRoutes);

// Serve PDFs
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));


// Listen on port 5000
app.listen(5000, () => {
    console.log('Server started on port 5000');
});
