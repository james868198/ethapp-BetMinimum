import { Router } from 'express';
import ContractRoute from './ContractRoute';
import betMinimunRoute from './betMinimunRoute';

/* GET home page. */

const root = Router();
const api = Router();

root.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

api.use('/contract', ContractRoute);
api.use('/game', betMinimunRoute);
root.use('/api', api);

module.exports = root;
