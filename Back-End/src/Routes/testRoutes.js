import express from 'express'
import { get,getbyId,save,update,deleted} from '../Controllers/testController.js';


const router = express.Router();


router.get('/',get);
router.get('/:id',getbyId);
router.post('/',save);
router.put('/:id',update);
router.delete('/:id',deleted);


export default router;