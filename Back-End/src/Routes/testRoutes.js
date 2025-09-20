import express from 'express'
import { checking } from '../Controllers/testController.js';


const router = express.Router();


router.get('/',checking);


export default router;