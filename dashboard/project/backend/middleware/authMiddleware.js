// /backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware to verify the token
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your secret
        req.user = decoded; // Attach the user info to the request object
        next(); // Proceed to the next middleware/route
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
