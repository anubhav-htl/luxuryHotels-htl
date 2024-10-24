import { body, validationResult } from 'express-validator';


const reviewsValidator = [
  body('email')
    .isEmail().withMessage('Invalid email address'),

  body('review_name')
    .isLength({ min: 5 }).withMessage('Your name must be at least 4 characters long'),
  
    body('review')
    .isLength({ min: 5 }).withMessage('Your review must be at least 5 characters long'),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export default reviewsValidator;