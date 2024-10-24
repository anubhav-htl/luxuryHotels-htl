// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";

// Secret key for JWT
const JWT_SECRET = "Luxury_hotel"; // You should store this in an environment variable

// Generate a JWT token
export const generateToken = (userId) => {
  const payload = {
    Id:userId,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Token expires in 1 day
};

// Verify a JWT token (Optional for protected routes)
export const verifyToken = (token) => {
  try {
    const x = jwt.verify(token, JWT_SECRET)
    return x;
  } catch (err) {
    throw new Error("Invalid verify Token");
  }
};

export const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  // const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user;
    console.log("user===============>", user);
    next();
  });
};
