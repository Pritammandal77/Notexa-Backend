import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import refreshToken from '../models/refreshToken.js';
import { User } from '../models/user.model.js';

const ACCESS_EXPIRES_IN = '2h'; // for JWT library
const REFRESH_EXPIRES_DAYS = 30;

export const createAccessToken = (user) => {
  // minimal payload
  const payload = { sub: user._id.toString(), email: User.email };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

// For refresh token we'll use a random UUID string, store a hashed version in DB
export const createRefreshToken = async ({ userId, ip, userAgent }) => {
  const plain = randomUUID();  // e.g. '550e8400-e29b-...'
  const hash = await bcrypt.hash(plain, 10);
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  const doc = await refreshToken.create({
    user: userId,
    tokenHash: hash,
    ip,
    userAgent,
    expiresAt
  });

  // return the plain token and DB id (optional)
  return { token: plain, id: doc._id, expiresAt };
};

export const rotateRefreshToken = async ({ oldTokenPlain, userId, ip, userAgent }) => {
  // optional: find and remove existing token, then create new
  // Implementation detail left for advanced rotation
};

export const consumeRefreshToken = async ({ tokenPlain }) => {
  // find a refresh token doc by matching hash
  const all = await RefreshToken.find(); // naive; better: store a tokenId in cookie to find quickly
  // Better approach: include refresh token id (doc._id) in cookie along with plain token
  // then fetch doc by id and compare hash -> more efficient
};
