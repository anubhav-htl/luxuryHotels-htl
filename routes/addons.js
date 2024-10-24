import express from 'express';
import { createAddOn, getAllAddOns, editAddOn } from '../controllers/addons.js';
import AddOn from '../models/addon.js';


const router = express.Router();


router.get('/', getAllAddOns);


router.get('/add', (req, res) => {
  res.render('addons/addaddon');
});

router.get('/edit/:addon_id', async (req, res) => {
  const { addon_id } = req.params;

  try {
    const addonData = await AddOn.findById(addon_id);
    res.render('addons/editaddon', { addonData });    
  } catch (error) {
    console.error(error);
  }
});

router.post('/edit/:addon_id', editAddOn );

router.post('/', createAddOn);

export default router;