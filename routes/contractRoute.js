import { Router } from 'express';
import contractController from '../controllers/contractController';

const router = Router();

router.route('/')
	.get(contractController.getAccountList)
router.route('/:address')
	.get(contractController.getAccountData)
    .post(contractController.transfer)
    
export default router;
