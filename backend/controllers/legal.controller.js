import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Client from '../models/client.model.js';
import Lawyer from '../models/lawyer.model.js';

// Lawyer signup
export const signup = async (req, res) => {
  console.log(req.body);
  console.log("sadsad");
  console.log(req.files.profilePic[0].filename);
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
    console.log(user);
    if (user) {
      console.log({ message: 'Email already registered' });
      console.log({ 'Email already registered': user });
      return res.status(400).send({ message: 'Email already registered' });
    }
    console.log(" signup");

    if (role === 'lawyer') {
      const existingLawyer = await Lawyer.findOne({ barRegistrationNumber });
      if (existingLawyer) {
        console.log({ message: 'Bar Registration Number already in use' });
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
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Lawyer login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Lawyer.findOne({ email });
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
      { expiresIn: '24h' }
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
      { expiresIn: '24h' }
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
  console.log('client login', req.body);
  try {
    const client = await Client.findOne({ email });
    console.log(client);
    if (!client) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    console.log("pass match", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: client._id, name: client.name, email: client.email, role: client.role },
      process.env.JWT_KEY,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('Client Login Error:', err.message);
    res.status(500).json({ message: 'Server error during client login' });
  }
};

// Auth0 Signup
// Auth0 Signup - Improved version
// controllers/legal.controller.js (authSignup only)
export const authSignup = async (req, res) => {
  console.log('\n=== AUTH0 SIGNUP REQUEST START ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Decoded token payload:', JSON.stringify(req.auth0User, null, 2));

  try {
    const { name, email, picture, auth0Id } = req.body; // From ClientLogin.jsx
    const tokenPayload = req.auth0User; // From token

    if (!process.env.JWT_KEY) {
      console.error('JWT_KEY is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Validate required fields
    if (!auth0Id || !email || !name) {
      console.error('Missing required fields:', { auth0Id, email, name });
      return res.status(400).json({
        message: 'Missing required fields: auth0Id, email, or name',
        received: { name, email, picture, auth0Id },
      });
    }

    // Verify token payload matches body
    if (tokenPayload.sub !== auth0Id || tokenPayload.email !== email) {
      console.error('Token payload mismatch:', {
        tokenSub: tokenPayload.sub,
        bodyAuth0Id: auth0Id,
        tokenEmail: tokenPayload.email,
        bodyEmail: email,
      });
      return res.status(400).json({ message: 'Token payload does not match request data' });
    }

    // Check for existing user
    let existingClient = await Client.findOne({
      $or: [{ auth0Id }, { email: email.toLowerCase().trim() }],
    });

    if (existingClient) {
      console.log('Existing user found:', existingClient._id);
      const token = jwt.sign(
        {
          id: existingClient._id,
          name: existingClient.name,
          email: existingClient.email,
          role: existingClient.role,
        },
        process.env.JWT_KEY,
        { expiresIn: '24h' },
      );
      return res.status(200).json({
        token,
        message: 'User already exists, logged in successfully',
        user: {
          id: existingClient._id,
          name: existingClient.name,
          email: existingClient.email,
          role: existingClient.role,
        },
      });
    }

    // Create new user
    const newClient = new Client({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      picture: picture || null,
      auth0Id,
      role: 'client',
      password: null,
    });

    const savedClient = await newClient.save();
    console.log('Client saved:', savedClient._id);

    const token = jwt.sign(
      {
        id: savedClient._id,
        name: savedClient.name,
        email: savedClient.email,
        role: savedClient.role,
      },
      process.env.JWT_KEY,
      { expiresIn: '24h' },
    );

    console.log('=== AUTH0 SIGNUP SUCCESS ===');
    res.status(201).json({
      token,
      message: 'Auth0 signup successful',
      user: {
        id: savedClient._id,
        name: savedClient.name,
        email: savedClient.email,
        role: savedClient.role,
      },
    });
  } catch (error) {
    console.error('Auth0 signup error:', error);
    res.status(500).json({
      message: 'Unexpected server error during Auth0 signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};


// Get user
export const getUserData = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const user = await Client.findOne({ email: userEmail }) || await Lawyer.findOne({ email: userEmail });
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

// Get lawyers
export const getLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find({}, 'name email phoneNumber barRegistrationNumber barCouncilState yearsOfExperience currentWorkplace profilePic role');
    if (!lawyers || lawyers.length === 0) {
      return res.status(404).json({ message: 'No lawyers found' });
    }
    res.json(lawyers);
  } catch (err) {
    console.error('Get Lawyers Error:', err.message);
    res.status(500).json({ message: 'Server error fetching lawyers' });
  }
};






