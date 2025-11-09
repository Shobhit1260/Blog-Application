const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const protect = async (req, res, next) => {
  let token;

  // check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // fallback to cookie (if frontend sends cookie)
  if (!token && req.cookies && req.cookies.Token) {
    token = req.cookies.Token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No Token' });
  }

  try {
    // @ts-ignore
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id).select('-password');
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
  }
};

module.exports = protect;
