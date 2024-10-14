// /backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'patient' },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    address: { type: String },
    phoneNumber: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
