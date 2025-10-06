import express from 'express'
import { signIn,signUp } from '../Controllers/authController.js';


const router = express.Router();


router.post('/login',signIn);
router.post('/signUp',signUp);


export default router;