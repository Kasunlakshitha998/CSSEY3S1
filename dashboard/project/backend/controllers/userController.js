// /backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
    console.log(req.body);

    const { 
        username, 
        password, 
        firstName, 
        lastName, 
        email, 
        address, 
        phoneNumber,
        role 
    } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: 'Email already registered' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to database
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'patient', // Default role is patient if not provided
            firstName,
            lastName,
            email,
            address,
            phoneNumber,
            // profilePicture: '', // No longer needed
        });

        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};



// User Login
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// /backend/controllers/userController.js
exports.setupUser = async (req, res) => {
    try {
        const { firstName, lastName, email, address, phoneNumber, profilePicture } = req.body;

        // Update the user's information
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            firstName,
            lastName,
            email,
            address,
            phoneNumber,
            profilePicture
        }, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the token
        const user = await User.findById(userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user); // Send back the user details
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
};