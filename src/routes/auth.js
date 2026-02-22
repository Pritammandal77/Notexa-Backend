// import express from 'express';
// import passport from 'passport';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { createAccessToken, createRefreshToken } from '../utils/tokenService.js';
// import RefreshToken from '../models/refreshToken.js';
// import { User } from '../models/user.model.js';

// const router = express.Router();

// const isProd = process.env.NODE_ENV === 'production';
// const FRONTEND_URL = process.env.FRONTEND_URL;

// // Set domain only in production, leave undefined for localhost
// const COOKIE_DOMAIN = isProd ? process.env.COOKIE_DOMAIN : undefined;

// // 1) Start Google OAuth
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // 2) Google Callback
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/auth/failure` }),
//   async (req, res) => {
//     try {
//       const user = req.user;
//       const accessToken = createAccessToken(user);

//       const ip = req.ip;
//       const userAgent = req.headers['user-agent'] ?? 'unknown';
//       const { token: refreshPlain, id: refreshId } = await createRefreshToken({
//         userId: user._id,
//         ip,
//         userAgent,
//       });

//       // Cookies (works for local & prod)
//       const cookieOptions = {
//         httpOnly: true,
//         secure: isProd,
//         sameSite: isProd ? 'None' : 'Lax', // cross-site for prod, Lax for local
//         path: '/',
//       };

//       res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });
//       res.cookie('refresh_token', refreshPlain, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });
//       res.cookie('refresh_token_id', refreshId.toString(), { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });

//       return res.redirect(`${FRONTEND_URL}/`);
//     } catch (err) {
//       console.error(err);
//       return res.redirect(`${FRONTEND_URL}/`);
//     }
//   }
// );

// // 3) Get user info (protected)
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

// // Refresh access token
// router.post('/refresh', async (req, res) => {
//   console.log("Route called")
//   try {
//     const refreshPlain = req.cookies['refresh_token'];
//     const refreshId = req.cookies['refresh_token_id'];
//     if (!refreshPlain || !refreshId) return res.status(401).json({ error: 'No refresh token' });

//     const doc = await RefreshToken.findById(refreshId);
//     if (!doc) return res.status(401).json({ error: 'Invalid refresh token id' });

//     if (new Date() > doc.expiresAt) {
//       await RefreshToken.findByIdAndDelete(refreshId);
//       return res.status(401).json({ error: 'Refresh token expired' });
//     }

//     const ok = await bcrypt.compare(refreshPlain, doc.tokenHash);
//     if (!ok) return res.status(401).json({ error: 'Refresh token mismatch' });

//     const user = await User.findById(doc.user);
//     const newAccessToken = createAccessToken(user);

//     const cookieOptions = {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? 'None' : 'Lax',
//       path: '/',
//       domain: COOKIE_DOMAIN,
//     };

//     res.cookie('access_token', newAccessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000 });

//     return res.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// // 5) Logout
// router.post('/logout', async (req, res) => {
//   try {
//     const refreshId = req.cookies['refresh_token_id'];
//     if (refreshId) await RefreshToken.findByIdAndDelete(refreshId);

//     const cookieOptions = {
//       httpOnly: true,
//       secure: isProd,               // MUST match creation
//       sameSite: isProd ? 'None' : 'Lax',
//       domain: COOKIE_DOMAIN,
//       path: '/'
//     };

//     res.clearCookie('access_token', cookieOptions);
//     res.clearCookie('refresh_token', cookieOptions);
//     res.clearCookie('refresh_token_id', cookieOptions);

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

// Set domain only in production, leave undefined for localhost.
const COOKIE_DOMAIN = isProd ? process.env.COOKIE_DOMAIN : undefined;

// 1) Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2) Google Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth/failure` }),
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

      // Cookies (works for local & production)
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax', // cross-site for prod, Lax for local
        path: '/',
      };

      res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 2 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });
      res.cookie('refresh_token', refreshPlain, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });
      res.cookie('refresh_token_id', refreshId.toString(), { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000, domain: COOKIE_DOMAIN });

      return res.redirect(`${process.env.FRONTEND_URL}/`);
    } catch (err) {
      console.error(err);
      return res.redirect(`${process.env.FRONTEND_URL}/`);
    }
  }
);

// 3) Get user info (protected)
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

// Refresh access token
router.post('/refresh', async (req, res) => {
  console.log("Route called")
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

// 5) Logout
router.post('/logout', async (req, res) => {
  try {
    const refreshId = req.cookies['refresh_token_id'];
    if (refreshId) await RefreshToken.findByIdAndDelete(refreshId);

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,               // MUST match creation
      sameSite: isProd ? 'None' : 'Lax',
      domain: COOKIE_DOMAIN,
      path: '/'
    };

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