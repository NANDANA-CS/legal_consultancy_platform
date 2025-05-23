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
export const authSignup = async (req, res) => {
  console.log('\n=== AUTH0 SIGNUP REQUEST START ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { name, email, picture, auth0Id } = req.body;

    // Check if JWT_KEY is available
    if (!process.env.JWT_KEY) {
      console.error('JWT_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    console.log('JWT_KEY is available:', process.env.JWT_KEY ? 'YES' : 'NO');

    // Validate required fields with detailed logging
    console.log('\n--- FIELD VALIDATION ---');
    console.log('auth0Id:', auth0Id, typeof auth0Id);
    console.log('email:', email, typeof email);
    console.log('name:', name, typeof name);
    console.log('picture:', picture, typeof picture);

    if (!auth0Id) {
      console.error('VALIDATION FAILED: Missing auth0Id');
      return res.status(400).json({ 
        message: 'Auth0 ID is required',
        received: { name, email, picture, auth0Id }
      });
    }

    if (!email) {
      console.error('VALIDATION FAILED: Missing email');
      return res.status(400).json({ 
        message: 'Email is required',
        received: { name, email, picture, auth0Id }
      });
    }

    if (!name) {
      console.error('VALIDATION FAILED: Missing name');
      return res.status(400).json({ 
        message: 'Name is required',
        received: { name, email, picture, auth0Id }
      });
    }

    console.log('✅ All required fields validated successfully');

    // Check database connection
    console.log('\n--- DATABASE CONNECTION CHECK ---');
    try {
      // Test database connection with a simple query
      const dbTest = await Client.findOne().limit(1);
      console.log('✅ Database connection is working');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      return res.status(500).json({ 
        message: 'Database connection error',
        error: dbError.message
      });
    }

    // Check if user already exists
    console.log('\n--- CHECKING FOR EXISTING USER ---');
    console.log('Searching for user with auth0Id:', auth0Id);
    console.log('Searching for user with email:', email);

    let existingClient;
    try {
      existingClient = await Client.findOne({ 
        $or: [
          { auth0Id: auth0Id },
          { email: email.toLowerCase().trim() }
        ]
      });
      console.log('Existing user query result:', existingClient ? 'FOUND' : 'NOT FOUND');
      if (existingClient) {
        console.log('Existing user details:', {
          id: existingClient._id,
          email: existingClient.email,
          auth0Id: existingClient.auth0Id,
          name: existingClient.name
        });
      }
    } catch (searchError) {
      console.error('❌ Error searching for existing user:', searchError);
      return res.status(500).json({ 
        message: 'Database search error',
        error: searchError.message
      });
    }

    if (existingClient) {
      console.log('\n--- HANDLING EXISTING USER ---');
      
      // If user exists but doesn't have auth0Id, update it
      if (!existingClient.auth0Id && existingClient.email === email.toLowerCase().trim()) {
        console.log('Updating existing user with Auth0 ID...');
        try {
          existingClient.auth0Id = auth0Id;
          if (picture) existingClient.picture = picture;
          const updatedUser = await existingClient.save();
          console.log('✅ User updated successfully:', updatedUser._id);
        } catch (updateError) {
          console.error('❌ Failed to update existing user:', updateError);
          return res.status(500).json({ 
            message: 'Failed to update user with Auth0 data',
            error: updateError.message
          });
        }
      }

      // Generate token for existing user
      console.log('Generating token for existing user...');
      try {
        const token = jwt.sign(
          { 
            id: existingClient._id, 
            name: existingClient.name, 
            email: existingClient.email, 
            role: existingClient.role 
          },
          process.env.JWT_KEY,
          { expiresIn: '24h' }
        );

        console.log('✅ Token generated successfully for existing user');
        console.log('=== AUTH0 SIGNUP SUCCESS (EXISTING USER) ===\n');
        
        return res.status(200).json({ 
          token, 
          message: 'User already exists, logged in successfully',
          user: {
            id: existingClient._id,
            name: existingClient.name,
            email: existingClient.email,
            role: existingClient.role
          }
        });
      } catch (tokenError) {
        console.error('❌ Failed to generate token for existing user:', tokenError);
        return res.status(500).json({ 
          message: 'Failed to generate authentication token',
          error: tokenError.message
        });
      }
    }

    // Create new user
    console.log('\n--- CREATING NEW USER ---');
    const newClientData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      picture: picture || null,
      auth0Id: auth0Id,
      role: 'client',
      password: null // Auth0 users don't have passwords
    };

    console.log('New client data to be saved:', JSON.stringify(newClientData, null, 2));

    let newClient;
    try {
      newClient = new Client(newClientData);
      console.log('Client model created, attempting to save...');
      
      const savedClient = await newClient.save();
      console.log('✅ Client saved to database successfully!');
      console.log('Saved client details:', {
        id: savedClient._id,
        name: savedClient.name,
        email: savedClient.email,
        auth0Id: savedClient.auth0Id,
        role: savedClient.role,
        createdAt: savedClient.date
      });

    } catch (saveError) {
      console.error('❌ Failed to save new client to database:');
      console.error('Error name:', saveError.name);
      console.error('Error message:', saveError.message);
      console.error('Error code:', saveError.code);
      console.error('Full error:', saveError);

      // Handle specific MongoDB errors
      if (saveError.code === 11000) {
        const duplicateField = Object.keys(saveError.keyPattern || {})[0] || 'unknown field';
        console.error('Duplicate key error for field:', duplicateField);
        return res.status(400).json({ 
          message: `${duplicateField} already exists in the system`,
          error: saveError.message
        });
      }

      // Handle validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors || {}).map(err => err.message);
        console.error('Validation errors:', validationErrors);
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationErrors,
          receivedData: newClientData
        });
      }

      return res.status(500).json({ 
        message: 'Failed to save user to database',
        error: saveError.message,
        errorType: saveError.name
      });
    }

    // Generate JWT token for new user
    console.log('\n--- GENERATING TOKEN FOR NEW USER ---');
    try {
      const token = jwt.sign(
        { 
          id: newClient._id, 
          name: newClient.name, 
          email: newClient.email, 
          role: newClient.role 
        },
        process.env.JWT_KEY,
        { expiresIn: '24h' }
      );

      console.log('✅ JWT token generated successfully for new user');
      console.log('Token payload:', {
        id: newClient._id,
        name: newClient.name,
        email: newClient.email,
        role: newClient.role
      });

      console.log('=== AUTH0 SIGNUP SUCCESS (NEW USER) ===\n');

      return res.status(201).json({ 
        token, 
        message: 'Auth0 signup successful',
        user: {
          id: newClient._id,
          name: newClient.name,
          email: newClient.email,
          role: newClient.role
        }
      });

    } catch (tokenError) {
      console.error('❌ Failed to generate JWT token for new user:', tokenError);
      
      // Delete the created user since we can't generate a token
      try {
        await Client.findByIdAndDelete(newClient._id);
        console.log('Rolled back: Deleted created user due to token generation failure');
      } catch (deleteError) {
        console.error('Failed to rollback user creation:', deleteError);
      }

      return res.status(500).json({ 
        message: 'User created but failed to generate authentication token',
        error: tokenError.message
      });
    }

  } catch (error) {
    console.error('\n=== AUTH0 SIGNUP UNEXPECTED ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== ERROR END ===\n');

    return res.status(500).json({ 
      message: 'Unexpected server error during Auth0 signup', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
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







// adiyilek olla code njan cheythath aann... ith kalanjal ninne njan vettum!!!!


export const testDatabase = async (req, res) => {
  try {
    console.log('=== DATABASE TEST ===');
    
    // Test Client model
    const clientCount = await Client.countDocuments();
    console.log('Total clients in database:', clientCount);
    
    // Test creating a simple client
    const testClient = new Client({
      name: 'Test User',
      email: 'test@example.com',
      auth0Id: 'test-auth0-id-' + Date.now(),
      role: 'client'
    });
    
    const validation = testClient.validateSync();
    if (validation) {
      console.log('Validation errors:', validation.errors);
      return res.json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    console.log('Test client validation passed');
    
    res.json({
      success: true,
      message: 'Database connection working',
      clientCount: clientCount,
      testValidation: 'passed'
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
};

// Test Auth0 token verification
export const testAuth0Token = async (req, res) => {
  try {
    console.log('=== AUTH0 TOKEN TEST ===');
    console.log('Headers:', req.headers);
    console.log('Auth0 user from middleware:', req.auth0User);
    
    res.json({
      success: true,
      message: 'Auth0 token verified successfully',
      user: req.auth0User,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Auth0 token test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Auth0 token test failed',
      error: error.message
    });
  }
};

// Test complete Auth0 flow
export const testAuth0Flow = async (req, res) => {
  try {
    console.log('=== COMPLETE AUTH0 FLOW TEST ===');
    console.log('Request body:', req.body);
    console.log('Auth0 user:', req.auth0User);
    
    const { name, email, auth0Id } = req.body;
    
    if (!name || !email || !auth0Id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        received: { name, email, auth0Id },
        required: ['name', 'email', 'auth0Id']
      });
    }
    
    // Try to create user without saving
    const testUser = new Client({
      name: name,
      email: email,
      auth0Id: auth0Id,
      role: 'client'
    });
    
    const validationError = testUser.validateSync();
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationError.errors
      });
    }
    
    res.json({
      success: true,
      message: 'Auth0 flow test completed successfully',
      userData: {
        name: testUser.name,
        email: testUser.email,
        auth0Id: testUser.auth0Id,
        role: testUser.role
      },
      validation: 'passed'
    });
    
  } catch (error) {
    console.error('Auth0 flow test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Auth0 flow test failed',
      error: error.message
    });
  }
};