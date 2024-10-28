import { body, validationResult } from "express-validator";

const registerValidator = [
  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),

  body("passwordConfirm")
    .isLength({ min: 5 })
    .withMessage("Password confirmation must be at least 5 characters long"),

  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // req.flash('error', errors.array().map(error => error.msg).join(', '));
      // return res.redirect('/representatives/register');
      console.log("Validation Errors", errors.array());
      return res
        .status(400)
        .json({ message: "validation error", errors: errors.array() });
    }
    next();
  },
];

export default registerValidator;
