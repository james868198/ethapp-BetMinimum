// var express = require('express');
// var router = express.Router();
import { Router } from 'express';
import ContractRoute from './ContractRoute';
import BetMinimunRoute from './BetMinimunRoute';

/* GET home page. */

module.exports = router;
export default (passport) => {
	const root = Router();
	const api = Router();

	router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
  });

	api.use('/ContractRoute', ContractRoute);
	api.use('/BetMinimunRoute', BetMinimunRoute);

	return root;
};