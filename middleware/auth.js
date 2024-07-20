// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Check for the presence of the Authorization header
  const tokenHeader = req.header('Authorization');
  if (!tokenHeader) return res.status(401).send('Access Denied');

  // Extract the token from the header
  const token = tokenHeader.replace('Bearer ', '');
  
  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'JWTSECRET');
    req.user = verified; // Add the verified user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).send('Invalid Token'); // Handle invalid token errors
  }
};

module.exports = auth;
