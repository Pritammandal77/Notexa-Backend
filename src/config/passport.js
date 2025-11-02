import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

passport.serializeUser((user, done) => done(null, User._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/auth/google/callback`
  callbackURL: "http://localhost:8000/api/auth/google/callback"

}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email,
        fullName: profile.displayName,
        profilePicture: profile.photos?.[0]?.value
      });
    } else if (!user.googleId) {
      // attach googleId if user existed via email
      user.googleId = profile.id;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
