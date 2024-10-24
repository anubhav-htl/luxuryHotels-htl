import express from 'express';
import passport from 'passport';
import Subscriptions from '../models/subscription.js'
import { ensureAdminAuthenticated, redirectIfAuthenticated } from '../middleware/auth.js';
import { createSubscription, updateSubscription } from '../controllers/admins.js';
//import { createAdmin } from '../controllers/admins.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('admin/login');
});

router.post('/login', redirectIfAuthenticated, passport.authenticate('admin', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      console.error('Error signing out:', err);
      return next(err);
    }
    res.redirect('/admin/login');
  });
});

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/subscriptions', async (req, res, next) => {
  try {
    const subscriptionData = await Subscriptions.find();

    if (!subscriptionData) {
      console.warn('No subscription found');
    }

    res.render('admin/subscriptions/viewsubscriptions', { subscriptionData });    
  } catch (error) {
    console.log(error);
  }
});


router.get('/subscriptions/addsubscription', (req, res) => {
  res.render('admin/subscriptions/addsubscription');
});

router.post('/addsubscription', createSubscription);

router.get('/subscriptions/edit/:subscription_id', async (req, res) => {
  const { subscription_id } = req.params;

  try {
    const subscriptionData = await Subscriptions.findById(subscription_id);
    res.render('admin/subscriptions/editsubscription', { subscriptionData });
  } catch (error) {
    console.error(error);
  }
});

router.post('/editsubscription/:subscription_id', updateSubscription);

export default router;