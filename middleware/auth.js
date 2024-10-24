import { request } from 'express';
import Admin from '../models/admin.js';
import HotelRepresentative from '../models/hotelrep.js';

export async function ensureAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user instanceof Admin) {
      return next();
  }

  req.flash('error', 'You dont have the right, Oh! You dont have the right!');
  return res.redirect('/admin/login');
}

export async function ensureRepAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user instanceof HotelRepresentative) {
    return next();
  }

  req.flash('error', 'You are not authorised to view this page');
  return res.redirect('/representatives/login');
}

export async function redirectIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user instanceof Admin) {
      return res.redirect('/admin/dashboard');
    }
    if (req.user instanceof HotelRepresentative) {
      return res.redirect('/hotels/generalinformation');
    }
  }

  next();
}