import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// Function to create a JWT token
const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = createToken(user._id);

        // Send token back to the client
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Checking if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Please enter a strong password (at least 8 characters)' });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { loginUser, registerUser };
