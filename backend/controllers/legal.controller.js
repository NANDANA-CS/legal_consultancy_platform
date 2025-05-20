import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Client from '../models/client.model.js';
import Lawyer from '../models/lawyer.model.js';

// User signup (create client or lawyer)
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await Client.findOne({ email }) || await Lawyer.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user based on role
    if (role === 'lawyer') {
      user = new Lawyer({ name, email, password: hashedPassword, role });
    } else {
      user = new Client({ name, email, password: hashedPassword, role: 'client' });
    }

    // Save user to database
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token to frontend
    res.status(201).json({ token });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user (check both Client and Lawyer models)
    let user = await Client.findOne({ email }) || await Lawyer.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    // Send token to frontend
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user data (protected route)
export const getUserData = async (req, res) => {
  try {
    // User ID and data from auth middleware
    const userId = req.user;
    const userData = req.userData;

    // Fetch user from database (optional, if you need more fields)
    let user = await Client.findById(userId) || await Lawyer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('Get User Data Error:', err.message);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
};
