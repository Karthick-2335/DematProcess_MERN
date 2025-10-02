import express from 'express'
import { taxMaster,occupationMaster,holdingNatureMaster,panExemptCatmaster,guardianRelationShip} from '../Controllers/masterController.js';


const router = express.Router();


router.get('/tax_master',taxMaster);
router.get('/occupation_master',occupationMaster);
router.get('/holding_nature_master',holdingNatureMaster);
router.get('/pan_exemptcat_master',panExemptCatmaster);
router.get('/nomineeandguardrel_masters',guardianRelationShip)


export default router;