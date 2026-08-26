/**
 * JWT helper – sign, verify, and refresh tokens.
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate an access token.
 * @param {object} payload – { id, role, phone }
 * @returns {string}
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
}

/**
 * Generate a refresh token.
 * @param {object} payload – { id }
 * @returns {string}
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
}

/**
 * Verify a JWT token.
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {Error} if token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/**
 * Generate both access and refresh tokens for a user.
 * @param {object} user – user record from DB
 * @returns {{ accessToken: string, refreshToken: string }}
 */
function generateTokenPair(user) {
  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
    phone: user.phone,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  return { accessToken, refreshToken };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateTokenPair,
};
