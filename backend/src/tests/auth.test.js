/**
 * Example unit tests for the Auth controller/service.
 */

const request = require('supertest');
const app = require('../../src/app'); // Import express app

// Mock Prisma and Firebase
jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../../src/config/firebase', () => ({
  verifyFirebaseToken: jest.fn(),
}));

const { prisma } = require('../../src/config/database');
const { verifyFirebaseToken } = require('../../src/config/firebase');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Setup mocks
      verifyFirebaseToken.mockResolvedValue({
        uid: 'firebase123',
        phone_number: '+919876543210',
      });

      prisma.user.findUnique.mockResolvedValue(null); // User does not exist

      const mockCreatedUser = {
        id: 'user-uuid',
        phone: '+919876543210',
        name: 'Test Farmer',
        role: 'farmer',
        firebaseUid: 'firebase123',
        isActive: true,
      };

      prisma.user.create.mockResolvedValue(mockCreatedUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firebaseIdToken: 'valid-token',
          phone: '+919876543210',
          name: 'Test Farmer',
          role: 'farmer',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe('user-uuid');
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 409 if user already exists', async () => {
      verifyFirebaseToken.mockResolvedValue({
        uid: 'firebase123',
        phone_number: '+919876543210',
      });

      prisma.user.findUnique.mockResolvedValue({ id: 'existing-uuid' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firebaseIdToken: 'valid-token',
          phone: '+919876543210',
          name: 'Test Farmer',
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/);
    });
  });
});
