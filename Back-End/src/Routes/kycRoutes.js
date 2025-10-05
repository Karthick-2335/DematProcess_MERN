import express from 'express'
import {saveOrUpdateRegister,getAll,getRegisterById,saveOrUpdateAddress,
    getAddressById,saveOrUpdateNominee,getNomineeById,saveOrUpdateProfile,getProfileById,
    saveOrUpdateBank,getBankById,KycOverallStatus
} from '../Controllers/kycController.js'
const router = express.Router();

router.post("/register", saveOrUpdateRegister);
router.get("/register/:id", getRegisterById);

router.post("/address", saveOrUpdateAddress);
router.get("/address/:registerId", getAddressById);

router.post("/nominee", saveOrUpdateNominee);
router.get("/nominee/:registerId", getNomineeById);

router.post("/profile", saveOrUpdateProfile);
router.get("/profile/:registerId", getProfileById);

router.post("/bank", saveOrUpdateBank);
router.get("/bank/:registerId", getBankById);
router.get('/get_kycinfo',getAll);
router.get('/kycoverall/:id',KycOverallStatus);

export default router;