/**
 * Auth controller – handles HTTP requests for authentication endpoints.
 */

const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');
const { MESSAGES, STATUS_CODES } = require('../constants');
const env = require('../config/env');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { firebaseIdToken, phone, name, role } = req.body;
      const result = await authService.register({ firebaseIdToken, phone, name, role });

      // Set refresh token as HttpOnly cookie
      res.cookie(env.JWT_REFRESH_COOKIE_NAME, result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, {
        message: MESSAGES.AUTH_REGISTER_SUCCESS,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
        statusCode: STATUS_CODES.CREATED,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { firebaseIdToken } = req.body;
      const result = await authService.login({ firebaseIdToken });

      res.cookie(env.JWT_REFRESH_COOKIE_NAME, result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, {
        message: MESSAGES.AUTH_LOGIN_SUCCESS,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      res.clearCookie(env.JWT_REFRESH_COOKIE_NAME);

      return successResponse(res, {
        message: MESSAGES.AUTH_LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refreshToken(req, res, next) {
    try {
      const refreshToken =
        req.body.refreshToken ||
        req.cookies[env.JWT_REFRESH_COOKIE_NAME];

      const result = await authService.refreshToken(refreshToken);

      res.cookie(env.JWT_REFRESH_COOKIE_NAME, result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, {
        message: MESSAGES.AUTH_TOKEN_REFRESHED,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);

      return successResponse(res, {
        message: MESSAGES.SUCCESS,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);

      return successResponse(res, {
        message: MESSAGES.AUTH_PROFILE_UPDATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);

      return successResponse(res, {
        message: MESSAGES.AUTH_PASSWORD_CHANGED,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
