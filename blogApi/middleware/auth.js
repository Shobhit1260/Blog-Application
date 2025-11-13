const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// Simple authentication middleware
// - Accepts token from `Authorization: Bearer <token>` or cookie `Token`
// - Verifies JWT using process.env.SECRET_KEY
// - Attaches `req.user` (without password) for downstream handlers
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.Token) {
    token = req.cookies.Token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Not authorized, user not found' });

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

module.exports = protect;
