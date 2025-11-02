# E2E Testing Documentation

## Overview

This directory contains the E2E (End-to-End) test infrastructure for the Fund Flick loan management system backend. The tests use Jest, Supertest, and MongoDB Memory Server to provide isolated, fast, and reliable testing.

## Directory Structure

```
src/__tests__/
├── setup/
│   ├── testSetup.ts       # MongoDB Memory Server setup and global hooks
│   ├── testApp.ts         # Express app instance for testing
│   └── testUtils.ts       # Helper utilities for tests
├── e2e/
│   └── auth.test.ts       # Example E2E test suite
├── fixtures/
│   └── testData.ts        # Test data fixtures
└── README.md             # This file
```

## Setup Components

### 1. Test Setup (`setup/testSetup.ts`)

Provides MongoDB Memory Server configuration and global hooks:

- `connectTestDatabase()` - Connects to in-memory MongoDB
- `closeTestDatabase()` - Closes connection and stops MongoDB Memory Server
- `clearTestDatabase()` - Clears all collections (useful between tests)
- `getTestDatabaseUri()` - Returns the test database URI

### 2. Test App (`setup/testApp.ts`)

Creates a separate Express app instance for testing without:
- Starting the actual server
- Connecting to the production database
- Initializing Socket.IO (unless needed)

### 3. Test Utilities (`setup/testUtils.ts`)

Helper functions for common test operations:

- `generateTestToken(payload)` - Generate JWT tokens for auth
- `createTestUserPayload(overrides)` - Create test user payloads
- `getAuthHeaders(payload)` - Generate auth headers for requests
- `generateRandomEmail()` - Generate unique test emails
- `generateRandomPhone()` - Generate unique test phone numbers
- `expectSuccessResponse(response, statusCode)` - Assert successful responses
- `expectErrorResponse(response, statusCode)` - Assert error responses

### 4. Test Fixtures (`fixtures/testData.ts`)

Centralized test data for consistency:

- Pre-defined test users (admin, branch manager, salesman)
- Test organization data
- Test branch data
- Test customer data
- Test loan and EMI data
- Helper functions to create variations

## Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### E2E Tests Only
```bash
pnpm test:e2e
```

### With Coverage
```bash
pnpm test:coverage
```

### Verbose Output
```bash
pnpm test:verbose
```

## Writing Tests

### Basic Test Structure

```typescript
import request from 'supertest';
import { testApp } from '../setup/testApp';
import { clearTestDatabase } from '../setup/testSetup';
import { createTestUser } from '../fixtures/testData';
import { getAuthHeaders } from '../setup/testUtils';

describe('Feature E2E Tests', () => {
  beforeEach(async () => {
    // Clear database before each test for isolation
    await clearTestDatabase();
  });

  it('should perform action successfully', async () => {
    // Arrange: Set up test data
    const testData = createTestUser();

    // Act: Make API request
    const response = await request(testApp)
      .post('/api/v2/endpoint')
      .set(getAuthHeaders())
      .send(testData)
      .expect(200);

    // Assert: Verify response
    expect(response.body).toHaveProperty('success', true);
  });
});
```

### Testing Authenticated Endpoints

```typescript
import { getAuthHeaders, createTestUserPayload } from '../setup/testUtils';

it('should access protected route with valid token', async () => {
  const authHeaders = getAuthHeaders();

  const response = await request(testApp)
    .get('/api/v2/protected-route')
    .set(authHeaders)
    .expect(200);

  expect(response.body).toHaveProperty('data');
});

it('should fail without authentication', async () => {
  const response = await request(testApp)
    .get('/api/v2/protected-route')
    .expect(401);

  expect(response.body).toHaveProperty('error');
});
```

### Testing with Different User Roles

```typescript
it('should allow admin to perform action', async () => {
  const adminPayload = createTestUserPayload({ role: 'SUPER_ADMIN' });
  const authHeaders = getAuthHeaders(adminPayload);

  const response = await request(testApp)
    .post('/api/v2/admin-action')
    .set(authHeaders)
    .expect(200);
});

it('should deny salesman from performing admin action', async () => {
  const salesmanPayload = createTestUserPayload({ role: 'SALESMAN' });
  const authHeaders = getAuthHeaders(salesmanPayload);

  const response = await request(testApp)
    .post('/api/v2/admin-action')
    .set(authHeaders)
    .expect(403);
});
```

### Using Test Fixtures

```typescript
import { createTestCustomer, createTestLoan } from '../fixtures/testData';

it('should create loan for customer', async () => {
  const customer = createTestCustomer();
  const loanData = createTestLoan({
    customerId: customer.id,
    loanAmount: 200000,
  });

  const response = await request(testApp)
    .post('/api/v2/loans')
    .set(getAuthHeaders())
    .send(loanData)
    .expect(201);
});
```

## Best Practices

1. **Test Isolation**: Always clear the database between tests
   ```typescript
   beforeEach(async () => {
     await clearTestDatabase();
   });
   ```

2. **Use Fixtures**: Leverage test data fixtures for consistency
   ```typescript
   const testUser = createTestUser({ email: 'specific@example.com' });
   ```

3. **Descriptive Test Names**: Use clear, descriptive test names
   ```typescript
   it('should reject loan application when credit score is below threshold', async () => {
     // Test implementation
   });
   ```

4. **AAA Pattern**: Follow Arrange-Act-Assert pattern
   ```typescript
   it('should do something', async () => {
     // Arrange: Set up test data
     const data = createTestData();

     // Act: Perform action
     const response = await request(testApp).post('/endpoint').send(data);

     // Assert: Verify results
     expect(response.status).toBe(200);
   });
   ```

5. **Test Both Success and Failure Cases**
   ```typescript
   describe('Create Customer', () => {
     it('should create customer with valid data', async () => {
       // Test success case
     });

     it('should fail with invalid email format', async () => {
       // Test validation failure
     });

     it('should fail with missing required fields', async () => {
       // Test missing data
     });
   });
   ```

## Configuration

### Jest Configuration (`jest.config.js`)

Key settings:
- `preset: 'ts-jest'` - TypeScript support
- `testEnvironment: 'node'` - Node.js environment
- `testTimeout: 30000` - 30-second timeout for E2E tests
- Coverage thresholds set to 50% (adjustable)

### Coverage Thresholds

Current thresholds (can be adjusted in `jest.config.js`):
```javascript
coverageThresholds: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50
  }
}
```

## Troubleshooting

### Tests Timeout
If tests timeout, increase the timeout in jest.config.js:
```javascript
testTimeout: 60000 // 60 seconds
```

### MongoDB Memory Server Fails to Start
- Check if port 27017 is available
- Ensure sufficient system memory
- Try clearing npm/pnpm cache

### Tests Fail Due to Missing Environment Variables
Environment variables are set in `testSetup.ts`:
```typescript
process.env.JSON_SECRET_KEY = 'test-secret-key-for-jwt';
```

Add more as needed for your tests.

## Next Steps

1. Implement actual test cases based on your API endpoints
2. Add tests for each major feature (loans, customers, EMI, payments)
3. Set up CI/CD pipeline to run tests automatically
4. Increase coverage thresholds as test suite grows
5. Add integration tests for critical workflows

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
