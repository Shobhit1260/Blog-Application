const express = require('express');
const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

// Start Google OAuth
router.get('/google', (req, res, next) => {
  // If strategy isn't registered, return 501 so frontend can show a message
  try {
    if (!passport._strategy('google')) {
      return res.status(501).json({ success: false, message: 'Google auth not configured on server' });
    }
  } catch (e) {
    return res.status(501).json({ success: false, message: 'Google auth not configured on server' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Callback
router.get('/google/callback', (req, res, next) => {
  try {
    if (!passport._strategy('google')) return res.status(501).send('Google auth not configured');
  } catch (e) {
    return res.status(501).send('Google auth not configured');
  }
  
  passport.authenticate('google', { session: false }, (err, user) => {
    const redirectBase = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (err) {
      console.error('Google auth error:', err);
      return res.redirect(redirectBase + '/login?error=oauth');
    }
    if (!user) return res.redirect(redirectBase + '/login?error=oauth');

    try {
      // create token and set cookie
      const token = user.generateToken();
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
      };
      res.cookie('Token', token, cookieOptions);

      

      return res.redirect(redirectBase);
    } catch (e) {
      console.error('Error in google callback:', e);
      return res.redirect(redirectBase + '/login?error=oauth');
    }
  })(req, res, next);
});

module.exports = router;
