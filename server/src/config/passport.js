const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link OAuth nodes if profile mathematically exists independently 
          if (!user.googleId) {
             user.googleId = profile.id;
             user.isVerified = true; // Automatically assumed verified via Google trust
             await user.save();
          }
          return done(null, user);
        } else {
          // Synthesize new array bypassing password collision completely
          const randomHex = crypto.randomBytes(16).toString('hex');
          const salt = await bcrypt.genSalt(10);
          const scramblePass = await bcrypt.hash(randomHex, salt);
          
          const roleSelection = req.query.state || 'student';

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: scramblePass,
            isVerified: true,
            role: roleSelection
          });
          return done(null, user);
        }
      } catch (err) {
        console.error("GoogleStrategy Authentication Engine Failure:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});

module.exports = passport;
