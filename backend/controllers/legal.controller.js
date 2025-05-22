import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Client from '../models/client.model.js';
import Lawyer from '../models/lawyer.model.js';

// lawyer signup
export const signup = async (req, res) => {
  console.log(req.body)
  const {
    name,
    email,
    password,
    phoneNumber,
    barRegistrationNumber,
    barCouncilState,
    yearsOfExperience,
    currentWorkplace,
    role,
  } = req.body;
  
  try {
    let user = await Lawyer.findOne({ email });
    console.log("inside signup");
    console.log(user)
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    

    if (role === 'lawyer') {
      const existingLawyer = await Lawyer.findOne({ barRegistrationNumber });
      if (existingLawyer) {
        return res.status(400).json({ message: 'Bar Registration Number already in use' });
      }
    }


    if (role === 'lawyer' && (!req.files || !req.files.profilePic)) {
      return res.status(400).json({ message: 'Profile picture is required for lawyers' });
    }


    if (role === 'lawyer') {
      if (!name || !email || !password || !phoneNumber || !barRegistrationNumber ||
          !barCouncilState || !yearsOfExperience || !currentWorkplace) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'lawyer') {
      user = new Lawyer({
        name,
        email,
        password: hashedPassword,
        role,
        phoneNumber,
        barRegistrationNumber,
        barCouncilState,
        yearsOfExperience: Number(yearsOfExperience),
        currentWorkplace,
        profilePic: req.files.profilePic[0].path,
      });
    } else {
      user = new Lawyer({ name, email, password: hashedPassword, role: 'lawyer' });
    }
    await user.save();
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};




// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    let user = await Lawyer.findOne({ email }) || await Lawyer.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }


    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );


    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// getuser
export const getUserData = async (req, res) => {
  try {

    const userId = req.user;
    const userData = req.userData;

    let user = await Client.findById(userId) || await Lawyer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


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