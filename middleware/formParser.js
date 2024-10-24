import qs from 'qs';

export function parseFormData(req, res, next) {
  if (req.is('application/x-www-form-urlencoded')){
    req.body = qs.parse(req.body);
  }
  next();
}