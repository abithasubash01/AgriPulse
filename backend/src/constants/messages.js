/**
 * Standardized response messages used by controllers and services.
 */

const MESSAGES = Object.freeze({
  // ─── General ──────────────────────────────
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  VALIDATION_ERROR: 'Validation failed',
  FORBIDDEN: 'You do not have permission to perform this action',
  TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',

  // ─── Auth ─────────────────────────────────
  AUTH_REGISTER_SUCCESS: 'Registration successful',
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_LOGOUT_SUCCESS: 'Logged out successfully',
  AUTH_TOKEN_REFRESHED: 'Token refreshed successfully',
  AUTH_INVALID_CREDENTIALS: 'Invalid credentials',
  AUTH_TOKEN_MISSING: 'Authentication token is missing',
  AUTH_TOKEN_INVALID: 'Authentication token is invalid or expired',
  AUTH_TOKEN_EXPIRED: 'Authentication token has expired',
  AUTH_UNAUTHORIZED: 'Unauthorized access',
  AUTH_PHONE_REQUIRED: 'Phone number is required',
  AUTH_OTP_SENT: 'OTP sent successfully',
  AUTH_OTP_INVALID: 'Invalid OTP',
  AUTH_OTP_EXPIRED: 'OTP has expired',
  AUTH_USER_EXISTS: 'User with this phone number already exists',
  AUTH_PASSWORD_CHANGED: 'Password changed successfully',
  AUTH_PASSWORD_MISMATCH: 'Current password is incorrect',
  AUTH_PROFILE_UPDATED: 'Profile updated successfully',

  // ─── Farmer ───────────────────────────────
  CROP_CREATED: 'Crop listing created successfully',
  CROP_UPDATED: 'Crop listing updated successfully',
  CROP_DELETED: 'Crop listing deleted successfully',
  CROP_NOT_FOUND: 'Crop listing not found',
  CROP_LIST_FETCHED: 'Crop listings fetched successfully',

  // ─── Buyer ────────────────────────────────
  BOOKMARK_ADDED: 'Listing bookmarked successfully',
  BOOKMARK_REMOVED: 'Bookmark removed successfully',
  BOOKMARK_EXISTS: 'Listing already bookmarked',
  ENQUIRY_SENT: 'Enquiry sent successfully',
  PURCHASE_MARKED: 'Purchase marked successfully',

  // ─── Mandi ────────────────────────────────
  MANDI_PRICES_FETCHED: 'Mandi prices fetched successfully',
  MANDI_PRICES_CACHED: 'Showing cached mandi prices',
  MANDI_PRICES_MOCK: 'Showing sample mandi prices (live data unavailable)',
  MANDI_COMPARISON_SUCCESS: 'Price comparison generated successfully',
  MANDI_RECOMMENDATION: 'Selling recommendation generated',

  // ─── Marketplace ──────────────────────────
  LISTING_CREATED: 'Marketplace listing created',
  LISTING_UPDATED: 'Marketplace listing updated',
  LISTING_DELETED: 'Marketplace listing deleted',
  REVIEW_ADDED: 'Review added successfully',

  // ─── Notifications ────────────────────────
  ALERT_CREATED: 'Price alert created successfully',
  ALERT_UPDATED: 'Price alert updated',
  ALERT_DELETED: 'Price alert deleted',
  ALERT_TRIGGERED: 'Price alert triggered',

  // ─── File Upload ──────────────────────────
  FILE_UPLOAD_SUCCESS: 'File uploaded successfully',
  FILE_UPLOAD_FAILED: 'File upload failed',
  FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
  FILE_TOO_LARGE: 'File size exceeds the limit',
});

module.exports = MESSAGES;
