// // legal.router.js
// import express from 'express';
// import upload from '../multer/multer.config.js';
// import auth from '../middlewares/auth.js';
// // import verifyAuth0Token from '../middlewares/auth0.js';
// import { login, signup, getUserData, clientLogin, clientSignup, getLawyers, authSignup, getLawyersdet } from '../controllers/legal.controller.js';

// const legal_router = express.Router();

// legal_router.post('/lawyersignup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), signup);
// legal_router.post('/login', login);
// legal_router.post('/clientsignup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), clientSignup);
// legal_router.post('/clientlogin', clientLogin);
// // legal_router.post('/authsignup',  authSignup);
// legal_router.get('/user', auth, getUserData);
// legal_router.get('/lawyers', getLawyers);
// legal_router.get('/lawyersdet/:id', getLawyersdet);

// export default legal_router;


import express from 'express';
import upload from '../multer/multer.config.js';
import auth from '../middlewares/auth.js';
import { login, signup, getUserData, clientLogin, clientSignup, getLawyers, authSignup, getLawyersdet, updateUserProfile, uploadProfilePic, getDashboardData, createConsultation, acceptConsultation, declineConsultation, cancelConsultation, uploadDocument, getDocumentsByConsultation } from '../controllers/legal.controller.js';

const legal_router = express.Router();

legal_router.post('/lawyersignup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), signup);
legal_router.post('/login', login);
legal_router.post('/clientsignup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), clientSignup);
legal_router.post('/clientlogin', clientLogin);
legal_router.post('/authsignup', authSignup);
legal_router.get('/user', auth, getUserData);
legal_router.put('/user', auth, updateUserProfile);
legal_router.post('/upload', auth, upload.fields([{ name: 'profilePic', maxCount: 1 }]), uploadProfilePic);
legal_router.get('/lawyers', getLawyers);
legal_router.get('/lawyersdet/:id', getLawyersdet);
legal_router.post('/consultations', auth, createConsultation);
legal_router.patch('/consultations/:id/accept', auth, acceptConsultation);
legal_router.patch('/consultations/:id/decline', auth, declineConsultation);
legal_router.patch('/consultations/:id/cancel', auth, cancelConsultation);
legal_router.post('/documents/upload', auth, uploadDocument);
legal_router.get('/documents/consultation/:id', auth, getDocumentsByConsultation);

legal_router.get('/dashboard',auth, getDashboardData);

export default legal_router;