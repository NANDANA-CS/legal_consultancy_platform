import express from 'express';
import upload from '../multer/multer.config.js';
import auth from '../middlewares/auth.js';
import { login, signup, getUserData } from '../controllers/legal.controller.js';

const legal_router = express.Router();

legal_router.post('/lawyersignup', upload.fields([
  { name: 'profilePic', maxCount: 1 },
//   { name: 'barCouncilId', maxCount: 1 },
]), signup);
legal_router.post('/login', login);
legal_router.get('/user', auth, getUserData);

export default legal_router;