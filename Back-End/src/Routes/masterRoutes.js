import express from 'express'
import { taxMaster,occupationMaster,holdingNatureMaster,panExemptCatmaster,
    guardianRelationShip,Statemaster,Countrymaster,AddressProofmaster} from '../Controllers/masterController.js';


const router = express.Router();


router.get('/tax_master',taxMaster);
router.get('/occupation_master',occupationMaster);
router.get('/holding_nature_master',holdingNatureMaster);
router.get('/pan_exemptcat_master',panExemptCatmaster);
router.get('/nomineeandguardrel_masters',guardianRelationShip)
router.get('/state_master',Statemaster);
router.get('/country_master',Countrymaster);
router.get('/addressproof_master',AddressProofmaster);


export default router;