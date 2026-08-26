/**
 * Auth service – business logic for authentication and user management.
 */

const { prisma } = require('../config/database');
const { verifyFirebaseToken } = require('../config/firebase');
const { generateTokenPair, verifyToken } = require('../helpers/jwt');
const { hashPassword, comparePassword } = require('../helpers/password');
const { NotFoundError, UnauthorizedError, ConflictError, BadRequestError } = require('../utils/errors');
const { MESSAGES, ROLES } = require('../constants');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Register a new user after Firebase OTP verification.
   * @param {object} data – { firebaseIdToken, phone, name, role }
   */
  async register({ firebaseIdToken, phone, name, role }) {
    // Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(firebaseIdToken);

    // Use the phone from the Firebase token if available
    const userPhone = firebaseUser.phone_number || phone;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { phone: userPhone },
    });

    if (existing) {
      throw new ConflictError(MESSAGES.AUTH_USER_EXISTS);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        phone: userPhone,
        name,
        role: role || ROLES.FARMER,
        firebaseUid: firebaseUser.uid,
        isActive: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair(user);

    logger.info(`User registered: ${user.id} (${user.role})`);

    return {
      user: this._sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login an existing user via Firebase OTP token.
   * @param {object} data – { firebaseIdToken }
   */
  async login({ firebaseIdToken }) {
    const firebaseUser = await verifyFirebaseToken(firebaseIdToken);
    const phone = firebaseUser.phone_number;

    // Find user by Firebase UID or phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: firebaseUser.uid },
          { phone },
        ],
      },
    });

    if (!user) {
      throw new NotFoundError('User not found. Please register first.');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated. Contact support.');
    }

    // Update Firebase UID if it changed
    if (user.firebaseUid !== firebaseUser.uid) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { firebaseUid: firebaseUser.uid },
      });
    }

    const tokens = generateTokenPair(user);

    logger.info(`User logged in: ${user.id}`);

    return {
      user: this._sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh the access token using a valid refresh token.
   * @param {string} refreshToken
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError(MESSAGES.AUTH_TOKEN_MISSING);
    }

    const decoded = verifyToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError(MESSAGES.AUTH_TOKEN_INVALID);
    }

    const tokens = generateTokenPair(user);

    return {
      user: this._sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Get user profile by ID.
   * @param {string} userId
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }

    return this._sanitizeUser(user);
  }

  /**
   * Update user profile.
   * @param {string} userId
   * @param {object} data
   */
  async updateProfile(userId, data) {
    const { name, email, district, state, avatar } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(district && { district }),
        ...(state && { state }),
        ...(avatar && { avatar }),
      },
    });

    logger.info(`Profile updated: ${userId}`);

    return this._sanitizeUser(user);
  }

  /**
   * Change password for a user (optional password-based auth layer).
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError(MESSAGES.NOT_FOUND);
    }

    // If user has a password, verify the current one
    if (user.passwordHash) {
      const isMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new BadRequestError(MESSAGES.AUTH_PASSWORD_MISMATCH);
      }
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    logger.info(`Password changed: ${userId}`);
  }

  /**
   * Remove sensitive fields from user object before sending to the client.
   * @param {object} user
   * @returns {object}
   */
  _sanitizeUser(user) {
    const { passwordHash, firebaseUid, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = new AuthService();
