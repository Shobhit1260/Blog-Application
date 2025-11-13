const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const sendtoken = require('../utils/sendtoken');

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/login' }), (req, res) => {
  // req.user set by passport verify callback
  if (!req.user) return res.redirect((process.env.FRONTEND_URL || 'http://localhost:5173') + '/login');
  // send jwt cookie and JSON response
  return sendtoken(200, req.user, res);
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/login' }), (req, res) => {
  if (!req.user) return res.redirect((process.env.FRONTEND_URL || 'http://localhost:5173') + '/login');
  return sendtoken(200, req.user, res);
});

module.exports = router;
