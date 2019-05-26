import { Router } from 'express';
import betMiniminController from '../controllers/betMiniminController';

const router = Router();

router.route('/')
    .get(betMiniminController.getGameStatus)
router.route('/:address')
	.get(betMiniminController.getAccountStatus)
    .post(betMiniminController.bet)
router.route('/:address/distribute')
    .post(betMiniminController.distribute)
    
export default router;
