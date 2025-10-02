import express from 'express'
import {kycRegisterSave} from '../Controllers/kycController.js'
const router = express.Router();

router.post('/kyc_register',kycRegisterSave);

export default router;