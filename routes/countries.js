import express from 'express';
import { createCountry, getAllCountries } from '../controllers/countries.js';

const router = express.Router();


router.get('/', getAllCountries);


router.get('/add', (req, res) => {
  res.render('countries/addcountry');
});

router.post('/', createCountry);

export default router;