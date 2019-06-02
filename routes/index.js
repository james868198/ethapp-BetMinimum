import { Router } from 'express';
import contractRoute from './contractRoute';
import betMinimunRoute from './betMinimunRoute';

const router = Router();
const apiRouter = Router();

router.get('/', (_, res) => res.render('index', { title: 'Express' }));

apiRouter.use('/contract', contractRoute);
apiRouter.use('/game', betMinimunRoute);
router.use('/api', apiRouter);

module.exports = router;
