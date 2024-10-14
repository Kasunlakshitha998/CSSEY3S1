// /backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware
// Route for user registration
router.post('/register', userController.registerUser);

// Route for user login
router.post('/login', userController.loginUser);

// /backend/routes/userRoutes.js
router.put('/setup', authMiddleware, userController.setupUser);

router.get('/me', authMiddleware, userController.getUserDetails);
module.exports = router;
