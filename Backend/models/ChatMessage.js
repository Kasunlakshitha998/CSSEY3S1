// models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
<<<<<<< Updated upstream
    message: { type: String, required: false }, // Set required to false for image messages
    file: { type: String }, // Add file field to store file URL
=======
    message: { type: String, required: true },
    file: { type: String }, // URL for image attachment
>>>>>>> Stashed changes
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
