const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function initPassport(app) {
  app.use(passport.initialize());

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: (process.env.BACKEND_URL || process.env.FRONTEND_URL || 'http://localhost:5000') + '/api/auth/google/callback'
        
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          let user = await User.findOne({ googleId: profile.id }) || (email ? await User.findOne({ email }) : null);
          if (!user) {
            const usernameBase = profile.displayName ? profile.displayName.replace(/\s+/g, '').toLowerCase() : 'googleuser';
            let username = usernameBase;
            let i = 0;
            while (await User.findOne({ username })) { i += 1; username = `${usernameBase}${i}` }
            user = await User.create({
              username,
              email: email || `${profile.id}@google.local`,
              googleId: profile.id,
              avatar: profile.photos && profile.photos[0] && profile.photos[0].value
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.avatar && profile.photos && profile.photos[0]) user.avatar = profile.photos[0].value;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }));
    } catch (err) {
      console.warn('Failed to initialize Google strategy', err.message || err);
    }
  } else {
    console.warn('Google OAuth not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
  }
};
