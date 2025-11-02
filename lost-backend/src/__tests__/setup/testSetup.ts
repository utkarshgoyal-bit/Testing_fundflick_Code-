import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Mock Firebase Admin before any imports that use it
jest.mock('../../firebase/firebaseAdmin', () => ({
  firebaseMessaging: {
    send: jest.fn(),
    sendMulticast: jest.fn(),
  },
}));

// Mock database connection from index.ts to prevent production DB connection
jest.mock('../../db/index', () => jest.fn());

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connect to the in-memory database
 */
export const connectTestDatabase = async (): Promise<void> => {
  try {
    // Create MongoDB Memory Server instance
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'fundflick-test',
      },
    });

    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    console.log('✅ Connected to MongoDB Memory Server');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Memory Server:', error);
    throw error;
  }
};

/**
 * Drop database, close the connection and stop MongoDB Memory Server
 */
export const closeTestDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }

    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }

    console.log('✅ Closed MongoDB Memory Server');
  } catch (error) {
    console.error('❌ Error closing MongoDB Memory Server:', error);
    throw error;
  }
};

/**
 * Remove all the data from all collections
 */
export const clearTestDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      throw new Error('Database not connected');
    }

    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log('🧹 Cleared all collections in test database');
  } catch (error) {
    console.error('❌ Error clearing test database:', error);
    throw error;
  }
};

/**
 * Get test database URI
 */
export const getTestDatabaseUri = (): string => {
  if (!mongoServer) {
    throw new Error('MongoDB Memory Server is not initialized');
  }
  return mongoServer.getUri();
};

// Global setup hooks
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JSON_SECRET_KEY = 'test-secret-key-for-jwt';
  process.env.JWT_SECRET = 'test-secret-key-for-jwt'; // For JWT generation
  process.env.JWT_SECRET_SALT = '10';

  // Mock Firebase service account to prevent initialization errors
  process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
    project_id: 'test-project',
    private_key: 'test-key',
    client_email: 'test@test.com',
  });

  // Connect to test database
  await connectTestDatabase();
}, 60000); // 60 second timeout for setup

// Note: We DON'T clear after each test to preserve seeded data
// Tests that need clean state should manually call clearTestDatabase()

// Global teardown hooks
afterAll(async () => {
  // Close database connection and stop MongoDB Memory Server
  await closeTestDatabase();
}, 60000); // 60 second timeout for teardown

// Handle any unhandled promise rejections during tests
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection in tests:', error);
});
