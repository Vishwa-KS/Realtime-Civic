const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header (format: Bearer <token>)
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach the user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = verifyToken;
