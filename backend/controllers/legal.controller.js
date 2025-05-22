import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Client from '../models/client.model.js';
import Lawyer from '../models/lawyer.model.js';

// lawyer signup
export const signup = async (req, res) => {
  console.log(req.body)
  console.log("sadsad")
 console.log( req.files.profilePic[0].filename)
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
      console.log({ message: 'Email already registered' })
      console.log({'Email already registered':user})
      return res.status(400).send({ message: 'Email already registered' });
    }
    console.log(" signup");


    if (role === 'lawyer') {
      const existingLawyer = await Lawyer.findOne({ barRegistrationNumber });
      if (existingLawyer) {
        console.log({ message: 'Bar Registration Number already in use' })
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
        profilePic: req.files.profilePic[0].filename,
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


// lawyer login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    let user = await Lawyer.findOne({ email })
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



// Client Signup
export const clientSignup = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    console.log('Client signup request body:', req.body);
    console.log('Uploaded files:', req.files);

    const existingEmail = await Client.findOne({ email }) || await Lawyer.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const requiredFields = { name, email, password, phoneNumber };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ message: `Missing required field: ${key}` });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = new Client({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: 'client',
      profilepic: req.files && req.files.profilePic ? req.files.profilePic[0].path : null,
    });

    await client.save();
    console.log('Client saved to database:', client);

    const token = jwt.sign(
      { id: client._id, name: client.name, email: client.email, role: client.role },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, message: 'Signup successful' });
  } catch (err) {
    console.error('Client Signup Error:', err);
    res.status(500).json({ message: 'Server error during client signup', error: err.message });
  }
};

// Client Login
export const clientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: client._id, name: client.name, email: client.email, role: client.role },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Client Login Error:', err.message);
    res.status(500).json({ message: 'Server error during client login' });
  }
};



















// getuser
export const getUserData = async (req, res) => {
  try {
    const userId = req.user;
    const user = await Client.findById(userId) || await Lawyer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      profilepic: user.profilepic || user.profilePic,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('Get User Data Error:', err.message);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
};