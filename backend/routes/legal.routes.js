import express from 'express';
import upload from '../multer/multer.config.js';
import auth from '../middlewares/auth.js';
import { verifyAuth0Token } from '../middlewares/auth0.js';
import { login, signup, getUserData, clientLogin, clientSignup, getLawyers, authSignup } from '../controllers/legal.controller.js';

const legal_router = express.Router();

legal_router.post('/lawyersignup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), signup);
legal_router.post('/login', login);

legal_router.post('/clientsignup', upload.fields([{ name: 'profilePic', maxCount: 1 }]), clientSignup);
legal_router.post('/clientlogin', clientLogin);

legal_router.post('/authsignup', verifyAuth0Token, authSignup);

legal_router.get('/user', auth, getUserData);
legal_router.get("/lawyers", getLawyers);

export default legal_router;