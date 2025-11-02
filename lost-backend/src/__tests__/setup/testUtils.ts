import jwt from 'jsonwebtoken';
import { JSON_SECRET_KEY } from '../../config';

/**
 * Generate a test JWT token for authentication
 */
export const generateTestToken = (payload: any, expiresIn: string = '1h'): string => {
  const secretKey = process.env.JSON_SECRET_KEY || JSON_SECRET_KEY;
  return jwt.sign(payload, secretKey, { expiresIn });
};

/**
 * Create a test user payload
 */
export const createTestUserPayload = (overrides: any = {}) => {
  return {
    id: 'test-user-id-123',
    email: 'test@example.com',
    role: 'admin',
    organizationId: 'test-org-id',
    ...overrides,
  };
};

/**
 * Generate auth headers for API requests
 */
export const getAuthHeaders = (payload?: any) => {
  const userPayload = payload || createTestUserPayload();
  const token = generateTestToken(userPayload);

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Wait for a specified amount of time (useful for async operations)
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generate a random email for testing
 */
export const generateRandomEmail = (): string => {
  const randomString = Math.random().toString(36).substring(7);
  return `test-${randomString}@example.com`;
};

/**
 * Generate a random phone number for testing
 */
export const generateRandomPhone = (): string => {
  const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomNumber.toString();
};

/**
 * Common test response expectations
 */
export const expectSuccessResponse = (response: any, statusCode: number = 200) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('success');
};

export const expectErrorResponse = (response: any, statusCode: number = 400) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('error');
};
