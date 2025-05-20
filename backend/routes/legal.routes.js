import express from 'express'
import upload from '../multer/multer.config.js'
import auth from '../middlewares/auth.js'
import { login, signup } from '../controllers/legal.controller.js';

const legal_router=express.Router()




legal_router.post('/signup', signup); 
legal_router.post('/login', login); 



export default legal_router