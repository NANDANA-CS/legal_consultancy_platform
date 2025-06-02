import express from 'express';
import { upload, uploadFields } from '../multer/multer.config.js';
import auth from '../middlewares/auth.js';
import {
  login,
  signup,
  getUserData,
  clientLogin,
  clientSignup,
  getLawyers,
  // authSignup,
  getLawyersdet,
  updateUserProfile,
  uploadProfilePic,
  getDashboardData,
  createConsultation,
  acceptConsultation,
  declineConsultation,
  cancelConsultation,
  uploadDocument,
  getDocumentsByConsultation,
  downloadDocument,
  fixDocumentPaths,
  createCase,
  getCasesByConsultation,
  getCaseById,
  createZoomMeeting,
  getZoomAccessToken,
} from '../controllers/legal.controller.js';

const legal_router = express.Router();

legal_router.post('/lawyersignup', uploadFields, signup);
legal_router.post('/login', login);
legal_router.post('/clientsignup', uploadFields, clientSignup);
legal_router.post('/clientlogin', clientLogin);
// legal_router.post('/authsignup', authSignup);
legal_router.get('/user', auth, getUserData);
legal_router.get('/user/:id', auth, getUserData);
legal_router.put('/user', auth, updateUserProfile);
legal_router.post('/upload', auth, uploadFields, uploadProfilePic);
legal_router.get('/lawyers', getLawyers);
legal_router.get('/lawyersdet/:id', getLawyersdet);
legal_router.post('/consultations', auth, createConsultation);
legal_router.patch('/consultations/:id/accept', auth, acceptConsultation);
legal_router.patch('/consultations/:id/decline', auth, declineConsultation);
legal_router.patch('/consultations/:id/cancel', auth, cancelConsultation);
legal_router.post('/documents/upload', auth, upload, uploadDocument);
legal_router.get('/documents/consultation/:id', auth, getDocumentsByConsultation);
legal_router.get('/documents/download/:filepath', auth, downloadDocument);
legal_router.post('/documentspath', auth, fixDocumentPaths);
legal_router.get('/dashboard', auth, getDashboardData);
legal_router.post('/cases', auth, upload, createCase);
legal_router.get('/cases/consultation/:id', auth, getCasesByConsultation);
legal_router.get('/cases/:caseId', auth, getCaseById);
legal_router.post('/zoom',createZoomMeeting)
legal_router.post('/getzoom',getZoomAccessToken)

export default legal_router;