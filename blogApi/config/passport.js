const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');
const { uploadStream } = require('../utils/cloudinary');

// Helper to create/find user from OAuth profile
async function findOrCreateUser({ provider, providerId, email, username, avatar }){
  try{
    let user = null;
    if (provider === 'github') user = await User.findOne({ githubId: providerId });
    if (provider === 'google') user = await User.findOne({ googleId: providerId });

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Ensure unique username by appending random suffix if needed
      let baseName = username || (email ? email.split('@')[0] : `${provider}-${providerId}`);
      let finalName = baseName;
      let i = 0;
      while (await User.findOne({ username: finalName })) {
        i++;
        finalName = `${baseName}${i}`;
      }

      const newUserData = {
        username: finalName,
        email: email || `${provider}-${providerId}@example.com`,
        password: Math.random().toString(36).slice(2), // random password (not used)
        bio: '',
        avatar: avatar || '',
      };

      if (provider === 'github') newUserData.githubId = providerId;
      if (provider === 'google') newUserData.googleId = providerId;

      user = await User.create(newUserData);
    } else {
      // Update provider id if missing
      let changed = false;
      if (provider === 'github' && !user.githubId) { user.githubId = providerId; changed = true; }
      if (provider === 'google' && !user.googleId) { user.googleId = providerId; changed = true; }
      if (avatar && !user.avatar) { user.avatar = avatar; changed = true; }
      if (changed) await user.save();
    }

    return user;
  } catch (err) {
    console.error('findOrCreateUser error', err);
    throw err;
  }
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: (process.env.BACKEND_URL || '') + '/api/auth/github/callback',
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile.id;
      // Attempt to get primary email
      let email = null;
      if (profile.emails && profile.emails.length) email = profile.emails[0].value;
      const username = profile.username || profile.displayName || `gh${providerId}`;
      const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;
      const user = await findOrCreateUser({ provider: 'github', providerId, email, username, avatar });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: (process.env.BACKEND_URL || '') + '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile.id;
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const username = profile.displayName || (email ? email.split('@')[0] : `g${providerId}`);
      const avatar = profile.photos && profile.photos[0] && profile.photos[0].value;
      const user = await findOrCreateUser({ provider: 'google', providerId, email, username, avatar });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

module.exports = passport;
