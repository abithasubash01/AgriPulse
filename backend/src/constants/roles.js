/**
 * User roles used across the application.
 */

const ROLES = Object.freeze({
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin',
});

const ROLE_VALUES = Object.values(ROLES);

module.exports = { ROLES, ROLE_VALUES };
