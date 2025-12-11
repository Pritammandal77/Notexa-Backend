// import express from 'express';
// import passport from 'passport';
// import { createAccessToken, createRefreshToken } from '../utils/tokenService.js';
// import RefreshToken from '../models/refreshToken.js';
// const router = express.Router();
// import { User } from '../models/user.model.js';

// // 1) Start auth
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // 2) Callback
// router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth/failure` }), 
//   async (req, res) => {
//     // req.user is set by passport
//     try {
//       const user = req.user;
//       const accessToken = createAccessToken(user);

//       // create refresh token
//       // include userAgent & ip for extra context
//       const ip = req.ip;
//       const userAgent = req.headers['user-agent'] ?? 'unknown';
//       const { token: refreshPlain, id: refreshId, expiresAt } = await createRefreshToken({
//         userId: user._id,
//         ip,
//         userAgent
//       });

//       // set cookies
//       const isProd = process.env.NODE_ENV === 'production';
//       // Access cookie - short lived
//       res.cookie('access_token', accessToken, {
//         httpOnly: true,
//         secure: isProd,
//         sameSite: 'lax',
//         maxAge: 2 * 60 * 60 * 1000, // 2 hours
//         domain: process.env.COOKIE_DOMAIN || 'localhost'
//       });

//       // Refresh cookie (store both id & token)
//       // We send refresh id in one cookie and token in another to find DB doc quickly.
//       res.cookie('refresh_token', refreshPlain, {
//         httpOnly: true,
//         secure: isProd,
//         sameSite: 'lax',
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         domain: process.env.COOKIE_DOMAIN || 'localhost'
//       });
//       res.cookie('refresh_token_id', refreshId.toString(), {
//         httpOnly: true,
//         secure: isProd,
//         sameSite: 'lax',
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         domain: process.env.COOKIE_DOMAIN || 'localhost'
//       });

//       // Redirect to frontend success page
//       const redirectUrl = `${process.env.FRONTEND_URL}/`;
//       return res.redirect(redirectUrl);
//     } catch (err) {
//       console.error(err);
//       return res.redirect(`${process.env.FRONTEND_URL}/`);
//     }
// });

// // 3) Protected endpoint to get user info (reads access token cookie)
// import jwt from 'jsonwebtoken';

// router.get('/me', async (req, res) => {
//   try {
//     const token = req.cookies['access_token'];
//     if (!token) return res.status(401).json({ error: 'No token' });

//     const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     const user = await User.findById(payload.sub).select('-__v');
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     return res.json({ user });
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// });

// // 4) Refresh endpoint
// import bcrypt from 'bcryptjs';
// router.post('/refresh', async (req, res) => {
//   try {
//     const refreshPlain = req.cookies['refresh_token'];
//     const refreshId = req.cookies['refresh_token_id'];
//     if (!refreshPlain || !refreshId) return res.status(401).json({ error: 'No refresh token' });

//     const doc = await RefreshToken.findById(refreshId);
//     if (!doc) return res.status(401).json({ error: 'Invalid refresh token id' });

//     // check expiry
//     if (new Date() > doc.expiresAt) {
//       await RefreshToken.findByIdAndDelete(refreshId);
//       return res.status(401).json({ error: 'Refresh token expired' });
//     }

//     const ok = await bcrypt.compare(refreshPlain, doc.tokenHash);
//     if (!ok) return res.status(401).json({ error: 'Refresh token mismatch' });

//     // OK -> issue new access token (and optionally rotate refresh token)
//     const user = await User.findById(doc.user);
//     const newAccessToken = createAccessToken(user);
//     // Optionally rotate refresh token: create new plain & hash, update doc
//     // For simplicity here we keep same refresh token until manual revocation/expiry
//     res.cookie('access_token', newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 2 * 60 * 60 * 1000,
//       domain: process.env.COOKIE_DOMAIN || 'localhost'
//     });

//     return res.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });


// // Logout - remove cookies and delete refresh token from DB
// router.post('/logout', async (req, res) => {
//   try {
//     const refreshId = req.cookies['refresh_token_id'];
//     if (refreshId) await RefreshToken.findByIdAndDelete(refreshId);

//     const isProd = process.env.NODE_ENV === 'production';
//     res.clearCookie('access_token', { domain: process.env.COOKIE_DOMAIN || 'localhost' });
//     res.clearCookie('refresh_token', { domain: process.env.COOKIE_DOMAIN || 'localhost' });
//     res.clearCookie('refresh_token_id', { domain: process.env.COOKIE_DOMAIN || 'localhost' });

//     return res.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Logout failed' });
//   }
// });

// export default router;


import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '../utils/tokenService.js';
import RefreshToken from '../models/refreshToken.js';
import { User } from '../models/user.model.js';

const router = express.Router();

const isProd = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL;

// Set domain only in production, leave undefined for localhost
const COOKIE_DOMAIN = isProd ? process.env.COOKIE_DOMAIN : undefined;

// -----------------------
// 1) Start Google OAuth
// -----------------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// -----------------------
// 2) Google Callback
// -----------------------
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/auth/failure` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = createAccessToken(user);

      const ip = req.ip;
      const userAgent = req.headers['user-agent'] ?? 'unknown';
      const { token: refreshPlain, id: refreshId } = await createRefreshToken({
        userId: user._id,
        ip,
        userAgent,
      });

      // -----------------------
      // Cookies (works for local & prod)
      // -----------------------
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax', // cross-site for prod, Lax for local
        path: '/',
      };

      res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });
      res.cookie('refresh_token', refreshPlain, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });
      res.cookie('refresh_token_id', refreshId.toString(), { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });

      return res.redirect(`${FRONTEND_URL}/`);
    } catch (err) {
      console.error(err);
      return res.redirect(`${FRONTEND_URL}/`);
    }
  }
);

// -----------------------
// 3) Get user info (protected)
// -----------------------
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies['access_token'];
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).select('-__v');
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// -----------------------
// 4) Refresh access token
// -----------------------
router.post('/refresh', async (req, res) => {
  try {
    const refreshPlain = req.cookies['refresh_token'];
    const refreshId = req.cookies['refresh_token_id'];
    if (!refreshPlain || !refreshId) return res.status(401).json({ error: 'No refresh token' });

    const doc = await RefreshToken.findById(refreshId);
    if (!doc) return res.status(401).json({ error: 'Invalid refresh token id' });

    if (new Date() > doc.expiresAt) {
      await RefreshToken.findByIdAndDelete(refreshId);
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    const ok = await bcrypt.compare(refreshPlain, doc.tokenHash);
    if (!ok) return res.status(401).json({ error: 'Refresh token mismatch' });

    const user = await User.findById(doc.user);
    const newAccessToken = createAccessToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/',
      domain: COOKIE_DOMAIN,
    };

    res.cookie('access_token', newAccessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000 });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// -----------------------
// 5) Logout
// -----------------------
router.post('/logout', async (req, res) => {
  try {
    const refreshId = req.cookies['refresh_token_id'];
    if (refreshId) await RefreshToken.findByIdAndDelete(refreshId);

    const cookieOptions = { path: '/', domain: COOKIE_DOMAIN };

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    res.clearCookie('refresh_token_id', cookieOptions);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
