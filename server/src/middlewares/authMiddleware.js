const jwt    = require('jsonwebtoken');
const { jwtSecret } = require('../config.js');

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
