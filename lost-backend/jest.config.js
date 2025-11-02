/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Roots and test match patterns
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts'
  ],

  // TypeScript transformation
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: true,
    }]
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/testSetup.ts'],

  // Coverage configuration (optional but recommended)
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds (optional - adjust as needed)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },

  // Test timeout (30 seconds for E2E tests)
  testTimeout: 30000,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Module name mapper for path aliases (if you have any)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controller/(.*)$': '<rootDir>/src/controller/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@models/(.*)$': '<rootDir>/src/schema/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@helper/(.*)$': '<rootDir>/src/helper/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1'
  },

  // Global setup/teardown (if needed)
  // globalSetup: '<rootDir>/src/__tests__/setup/globalSetup.ts',
  // globalTeardown: '<rootDir>/src/__tests__/setup/globalTeardown.ts',
};
