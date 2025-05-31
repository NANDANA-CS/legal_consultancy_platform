import jwt from 'jsonwebtoken';
import axios from 'axios'
import bcrypt from 'bcrypt';
import Client from '../models/client.model.js';
import Lawyer from '../models/lawyer.model.js';
import Appointment from '../models/appoinment.model.js';
import Consultation from '../models/consultation.model.js';
import Document from '../models/document.model.js';
import multer from 'multer';
import path, { join } from 'path';
import url from 'url';
import fs from 'fs';
import mime from 'mime-types';
import Case from '../models/case.model.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
export const authSignup = async (req, res) => {
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Decoded token payload:', JSON.stringify(req.auth0User, null, 2));

  try {
    const { name, email, picture, auth0Id } = req.body;
    const tokenPayload = req.auth0User;

    if (!process.env.JWT_KEY) {
      console.error('JWT_KEY is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    if (!auth0Id || !email || !name) {
      console.error('Missing required fields:', { auth0Id, email, name });
      return res.status(400).json({
        message: 'Missing required fields: auth0Id, email, or name',
        received: { name, email, picture, auth0Id },
      });
    }

    if (tokenPayload.sub !== auth0Id || tokenPayload.email !== email) {
      console.error('Token payload mismatch:', {
        tokenSub: tokenPayload.sub,
        bodyAuth0Id: auth0Id,
        tokenEmail: tokenPayload.email,
        bodyEmail: email,
      });
      return res.status(400).json({ message: 'Token payload does not match request data' });
    }

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

    console.log(' AUTH0 SIGNUP SUCCESS ');
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
    console.log(req.id);
    const id = req.params.id || req.id; 
    const user = await Client.findById(id) || await Lawyer.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      profilePic: user.profilepic || user.profilePic,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || null,
      barRegistrationNumber: user.barRegistrationNumber || null,
      barCouncilState: user.barCouncilState || null,
      yearsOfExperience: user.yearsOfExperience || null,
      currentWorkplace: user.currentWorkplace || null,
      expertise: user.expertise || null,
      availabilitySlots: user.availabilitySlots || [],
    });
  } catch (err) {
    console.error('Get User Data Error:', err.message);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const id = req.id;
    const {
      name,
      email,
      phoneNumber,
      role,
      barRegistrationNumber,
      barCouncilState,
      yearsOfExperience,
      currentWorkplace,
      expertise,
      availabilitySlots,
      profilePic,
    } = req.body;

    console.log(req.body);

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (role === 'lawyer') {
      if (!barRegistrationNumber) {
        return res.status(400).json({ message: 'Bar Registration Number is required for lawyers' });
      }
      if (!barCouncilState) {
        return res.status(400).json({ message: 'Bar Council State is required for lawyers' });
      }

      const existingLawyer = await Lawyer.findOne({
        barRegistrationNumber,
        _id: { $ne: id },
      });
      if (existingLawyer) {
        return res.status(400).json({ message: 'Bar Registration Number already in use' });
      }
    }

    let cleanedSlots = [];
    if (Array.isArray(availabilitySlots)) {
      cleanedSlots = availabilitySlots.filter(
        (slot) =>
          slot.day &&
          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(slot.day) &&
          slot.startTime &&
          slot.endTime
      );
    }

    const updateData = {
      name: name.trim(),
      phoneNumber: phoneNumber || null,
      profilePic: profilePic || null,
      email: email || null,
    };

    if (role === 'lawyer') {
      updateData.barRegistrationNumber = barRegistrationNumber || null;
      updateData.barCouncilState = barCouncilState || null;
      updateData.yearsOfExperience = yearsOfExperience ? Number(yearsOfExperience) : null;
      updateData.currentWorkplace = currentWorkplace || null;
      updateData.expertise = expertise || null;
      updateData.availabilitySlots = cleanedSlots;
    }
    console.log("hiii hello");

    let updatedUser;
    if (role === 'client') {
      updatedUser = await Client.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else if (role === 'lawyer') {
      updatedUser = await Lawyer.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: updatedUser._id,
      profilePic: updatedUser.profilepic || updatedUser.profilePic,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber || null,
      barRegistrationNumber: updatedUser.barRegistrationNumber || null,
      barCouncilState: updatedUser.barCouncilState || null,
      yearsOfExperience: updatedUser.yearsOfExperience || null,
      currentWorkplace: updatedUser.currentWorkplace || null,
      expertise: updatedUser.expertise || null,
      availabilitySlots: updatedUser.availabilitySlots || [],
    });
  } catch (err) {
    console.error('Update Profile Error:', err.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Upload profile picture
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.files || !req.files.profilePic) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = req.files.profilePic[0].filename;
    res.json({ filePath });
  } catch (err) {
    console.error('Upload Profile Pic Error:', err.message);
    res.status(400).json({ message: 'Error uploading profile picture' });
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

// Get lawyer details by ID
export const getLawyersdet = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyer = await Lawyer.findById(id);
    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    res.json(lawyer);
  } catch (err) {
    console.error('Get Lawyer Details Error:', err.message);
    res.status(500).json({ message: 'Server error fetching lawyer details' });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.id;
    console.log(`[GetDashboard] Fetching data for user: ${userId}`);

    const user = await Client.findById(userId) || await Lawyer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let consultations;
    if (user.role === 'client') {
      consultations = await Consultation.find({ clientId: userId })
        .populate('lawyerId', 'name email profilePic')
        .sort({ dateTime: -1 });
    } else if (user.role === 'lawyer') {
      consultations = await Consultation.find({ lawyerId: userId })
        .populate('clientId', 'name email profilePic')
        .sort({ dateTime: -1 });
    }
    for (let consultation of consultations) {
      const cases = await Case.find({ consultationId: consultation._id }).select('status title');
      consultation._doc.cases = cases; 
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
      consultations,
    });
  } catch (error) {
    console.error(`[GetDashboard] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};
 export const createConsultation = async (req, res) => {
  try {
    const { clientId, dateTime, notes } = req.body;
    const clientName = clientId.name || 'Unknown Client'; 
    const meetLink = await createZoomMeeting({ clientName, dateTime });
    const consultation = await Consultation.create({
      clientId,
      dateTime,
      notes,
      meetLink,
      status: 'Scheduled',
      accept: false,
    });

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create consultation', error: error.message });
  }
};

export const acceptConsultation = async (req, res) => {
  try {
    const consultationId = req.params.id;
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.lawyerId.toString() !== req.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    consultation.accept = true;
    await consultation.save();

    res.json({ message: 'Consultation accepted' });
  } catch (error) {
    console.error('Error accepting consultation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const declineConsultation = async (req, res) => {
  try {
    const consultationId = req.params.id;
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.lawyerId.toString() !== req.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    consultation.status = 'cancelled';
    await consultation.save();

    res.json({ message: 'Consultation declined' });
  } catch (error) {
    console.error('Error declining consultation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelConsultation = async (req, res) => {
  try {
    const consultationId = req.params.id;
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.clientId.toString() !== req.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (consultation.accept) {
      return res.status(400).json({ message: 'Cannot cancel an accepted consultation' });
    }

    consultation.status = 'cancelled';
    await consultation.save();

    res.json({ message: 'Consultation cancelled' });
  } catch (error) {
    console.error('Error cancelling consultation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload document
export const uploadDocument = async (req, res) => {
  try {
    const { consultationId, lawyerId } = req.body;
    const clientId = req.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!consultation.accept) {
      return res.status(400).json({ message: 'Documents can only be uploaded for accepted consultations' });
    }

    if (consultation.lawyerId.toString() !== lawyerId) {
      return res.status(400).json({ message: 'Invalid lawyer ID for this consultation' });
    }

    const document = new Document({
      ownerId: clientId,
      lawyerId: lawyerId,
      filename: req.file.filename,
      filepath: `/images/${req.file.filename}`,
      consultationId: consultationId,
    });

    await document.save();

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDocumentsByConsultation = async (req, res) => {
  try {
    const { id: consultationId } = req.params;
    const { caseId } = req.query; 
    const userId = req.id;
    console.log("hei bb",consultationId)
    console.log("hei bb",caseId)
    console.log("hei bb",userId)

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    if (
      consultation.clientId.toString() !== userId &&
      consultation.lawyerId.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const query = {
      ownerId: consultation.clientId,
      lawyerId: consultation.lawyerId,
      consultationId,
    };
    if (caseId) {
      query.caseId = caseId;
    }

    const documents = await Document.find(query).sort({ uploadedAt: -1 });
    console.log(documents)
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const fixDocumentPaths = async (req, res) => {
  try {
    const documents = await Document.find();
    let updatedCount = 0;
    for (const doc of documents) {
      let newPath = doc.filepath;
      if (newPath.startsWith('/uploads/')) {
        newPath = newPath.replace('/uploads/', '/images/');
      } else if (newPath.startsWith('/upload/')) {
        newPath = newPath.replace('/upload/', '/images/');
      }
      if (newPath !== doc.filepath) {
        doc.filepath = newPath;
        await doc.save();
        updatedCount++;
        console.log(`Updated document ${doc._id}: ${doc.filepath}`);
      }
    }
    console.log(`Document paths updated successfully: ${updatedCount} documents modified`);
    res.status(200).json({ message: `Document paths updated: ${updatedCount} documents modified` });
  } catch (error) {
    console.error('Error updating document paths:', error);
    res.status(500).json({ message: 'Server error updating document paths' });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const { filepath } = req.params;
    const userId = req.id;
    console.log(` Requested file: ${filepath}`);
    console.log(` User ID: ${userId}`);
    const expectedFilepath = `/images/${filepath}`.replace(/\\/g, '/').trim();
    console.log(` Querying database for filepath: ${expectedFilepath}`);
    let document = await Document.findOne({ filepath: expectedFilepath });
    if (!document) {
      console.log(` Exact match not found, trying case-insensitive search`);
      document = await Document.findOne({
        filepath: { $regex: `^${expectedFilepath}$`, $options: 'i' }
      });
    }

    if (!document) {
      console.error(` Document not found for filepath: ${expectedFilepath}`);
      console.log(` Listing all document filepaths in database:`);
      const allDocs = await Document.find({}, 'filepath');
      console.log(allDocs.map(doc => doc.filepath));
      return res.status(404).json({ message: 'Document not found in database' });
    }
    console.log(` Found document: ${document._id}`);

    if (
      document.ownerId.toString() !== userId &&
      document.lawyerId.toString() !== userId
    ) {
      console.error(` Unauthorized access by user: ${userId}`);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    console.log("hi hello");

    const sanitizedFilename = path.basename(filepath);
    const absolutePath = path.join(__dirname, '..', 'images', sanitizedFilename);
    console.log(`Resolved file path: ${absolutePath}`);
    if (!fs.existsSync(absolutePath)) {
      console.error(`File not found on server: ${absolutePath}`);
      console.log(`Listing files in images/ directory:`);
      try {
        fs.readdirSync(path.join(__dirname, '..', 'images')).forEach(file => console.log(file));
      } catch (err) {
        console.error(`Error reading images directory: ${err.message}`);
      }
      return res.status(404).json({ message: 'File not found on server' });
    }
    try {
      fs.accessSync(absolutePath, fs.constants.R_OK);
      console.log(`File is readable`);
    } catch (err) {
      console.error(`File permission error: ${err.message}`);
      return res.status(500).json({ message: 'File access error' });
    }
    const mimeType = mime.lookup(absolutePath) || 'application/octet-stream';
    res.setHeader('Content-Disposition', `attachment; filename=${document.filename}`);
    res.setHeader('Content-Type', mimeType);
    console.log(`Serving file with MIME type: ${mimeType}`);
    fs.createReadStream(absolutePath).pipe(res);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    res.status(500).json({ message: 'Server error downloading document', error: error.message });
  }
};

export const createCase = async (req, res) => {
  try {
    const { title, type, description, consultationId, lawyerId } = req.body;
    const clientId = req.id;
    const file = req.file;

    console.log(`[CreateCase] Request:`, { title, type, description, consultationId, lawyerId, clientId, hasFile: !!file });

    if (!title || !type || !description || !consultationId || !lawyerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (consultation.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the client for this consultation' });
    }
    if (consultation.lawyerId.toString() !== lawyerId) {
      return res.status(400).json({ message: 'Invalid lawyer ID for this consultation' });
    }
    if (!consultation.accept) {
      return res.status(400).json({ message: 'Case can only be registered for accepted consultations' });
    }

    const caseData = {
      clientId,
      lawyerId,
      consultationId,
      title: title.trim(),
      type: type.trim(),
      description: description.trim(),
      status: 'pending',
    };

    if (file) {
      const filePath = `/images/${file.filename}`;
      caseData.updates = [
        {
          message: `Initial case document uploaded: ${file.filename}`,
          timestamp: new Date(),
        },
      ];
      const document = new Document({
        ownerId: clientId,
        lawyerId,
        filename: file.filename,
        filepath: filePath,
        consultationId,
        caseId: null,
      });
      await document.save();
      caseData.documents = [document._id];
    }

    const newCase = new Case(caseData);
    await newCase.save();

    if (file) {
      await Document.updateOne({ _id: caseData.documents[0] }, { caseId: newCase._id });
    }

    console.log(`[CreateCase] Case created: ${newCase._id}`);

    res.status(201).json({
      message: 'Case registered successfully',
      case: {
        _id: newCase._id,
        clientId: newCase.clientId,
        lawyerId: newCase.lawyerId,
        consultationId: newCase.consultationId,
        title: newCase.title,
        type: newCase.type,
        description: newCase.description,
        status: newCase.status,
        updates: newCase.updates,
        createdAt: newCase.createdAt,
      },
    });
  } catch (error) {
    console.error(`[CreateCase] Error: ${error.message}`);
    console.error(`[CreateCase] Stack trace: ${error.stack}`);
    res.status(500).json({ message: 'Server error creating case', error: error.message });
  }
}

export const getCasesByConsultation = async (req, res) => {
  try {
    const { id: consultationId } = req.params;
    const userId = req.id;

    console.log(`Consultation ID: ${consultationId}, User ID: ${userId}`);

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    if (
      consultation.clientId.toString() !== userId &&
      consultation.lawyerId.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const cases = await Case.find({ consultationId }).sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error(`[GetCases] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching cases' });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;
    const userId = req.id;

    console.log(`[GetCaseById] Case ID: ${caseId}, User ID: ${userId}`);

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (
      caseData.lawyerId.toString() !== userId &&
      caseData.clientId.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(caseData);
  } catch (error) {
    console.error(`[GetCaseById] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching case details' });
  }
};



export const createZoomMeeting = async (consultationDetails) => {
  try {
    const accessToken = await getZoomAccessToken();
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: `Consultation with ${consultationDetails.clientName || 'Client'}`,
        type: 2,
        start_time: consultationDetails.dateTime,
        duration: 60, 
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.join_url;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    throw new Error('Failed to create Zoom meeting');
  }
};


export const getZoomAccessToken = async () => {
  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'account_credentials',
        account_id: ZOOM_ACCOUNT_ID,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Zoom');
  }
};


