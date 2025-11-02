# E2E Testing Guide for FundFlick Backend (Updated Nov 2025)

## Overview

This directory contains end-to-end tests for the FundFlick Loan Origination System backend. The test suite validates complete application flows including authentication, multi-tenancy isolation, permissions, and business operations.

## Test Structure

```
__tests__/
├── e2e/                               # End-to-end test suites
│   ├── auth.test.ts                   # Authentication flows
│   ├── backOfficeOperations.test.ts   # Back office workflows
│   └── organizationIsolation.test.ts  # Multi-tenancy security tests (NEW)
├── fixtures/                          # Test data and files
│   ├── testData.ts                    # Reusable test data
│   └── test-cibil.txt                 # Sample file for upload tests
├── setup/                             # Test configuration and utilities
│   ├── seedDatabase.ts                # Database seeding functions
│   ├── testSetup.ts                   # Jest setup and teardown
│   └── testUtils.ts                   # Common test utilities
└── README.md                          # This file
```

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
# or
pnpm test:e2e
```

### Run Specific Test File
```bash
npm run test:e2e -- auth.test.ts
npm run test:e2e -- organizationIsolation.test.ts
npm run test:e2e -- backOfficeOperations.test.ts
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Detailed Output
```bash
npm run test:e2e -- --verbose
```

## Test Database

Tests use MongoDB Memory Server for isolated test execution:
- Each test suite gets a clean in-memory database
- Data is automatically seeded before tests
- Database is cleaned up after tests complete
- No impact on development or production databases
- Realistic production-like environment

## Available Test Users

The seed data provides several test users with different roles and permissions:

| User Type | Email | Password | Role | Organization | Key Permissions |
|-----------|-------|----------|------|--------------|-----------------|
| Admin | admin@test.com | Test@123 | Super Admin | Org 1 | All permissions (no roleRef) |
| Salesman | salesman@test.com | Test@123 | Sales Man | Org 1 | `customer_file_view`, `customer_file_create`, `customer_file_update`, `customer_file_view_self` |
| Back Office | backoffice@test.com | Test@123 | Back Office | Org 1 | `customer_file_view`, `customer_file_view_others`, `verify_step`, `telephone_verification`, `customer_file_verify_step` |
| Credit Manager | creditmanager@test.com | Test@123 | Credit Manager | Org 1 | `customer_file_view`, `customer_file_view_others`, `customer_file_task_approved`, `customer_file_task_rejected` |
| Marketing Manager | marketingmanager@test.com | Test@123 | Marketing Manager | Org 1 | `customer_file_view`, `customer_file_view_others`, `customer_file_task_pending`, `customer_file_send_review` |
| Payment Collector | paymentcollector@test.com | Test@123 | Payment Collector | Org 1 | `customer_file_view`, `customer_file_view_others`, `customer_file_fees` |
| Org2 User | org2user@test.com | Test@123 | Branch Manager | Org 2 | `customer_file_view`, `customer_file_create`, `customer_file_update`, `customer_file_view_others` |
| Inactive User | inactive@test.com | Test@123 | Sales Man | Org 1 | Account deactivated |

**Usage Example:**
```typescript
const credentials = getTestCredentials('salesman');
// Returns: { email: 'salesman@test.com', password: 'Test@123' }
```

## Writing Tests

### Test File Naming Convention
- E2E tests: `*.test.ts` or `*.spec.ts`
- Place in `e2e/` subdirectory
- Use descriptive names (e.g., `organizationIsolation.test.ts`, `paymentFlow.test.ts`)

### Basic Test Structure

```typescript
import request from 'supertest';
import app from '../../index';
import { seedAll, getTestCredentials, cleanDatabase } from '../setup/seedDatabase';

describe('Feature Name E2E Tests', () => {
  // Seed once before all tests
  beforeAll(async () => {
    await cleanDatabase();
    await seedAll();
  }, 60000); // 60 second timeout for setup

  // Clean up after all tests
  afterAll(async () => {
    await cleanDatabase();
  });

  // Optional: beforeEach for test-specific setup
  beforeEach(async () => {
    // Setup code that runs before each test
  });

  it('should perform expected behavior', async () => {
    // Get test user credentials
    const credentials = getTestCredentials('salesman');

    // Login to get token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: credentials.email,
        password: credentials.password,
        browser: 'Chrome',
        os: 'Windows',
        loggedIn: 1,
        updatedAt: Date.now(),
      });

    const token = loginResponse.body.data.token;
    const orgId = loginResponse.body.data.organizations[0]._id;

    // Make authenticated request
    const response = await request(app)
      .get('/customer-file')
      .set('Authorization', `Bearer ${token}`)
      .set('organization', orgId);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

## Common Test Patterns

### 1. Testing Authentication
```typescript
const credentials = getTestCredentials('salesman');
const response = await request(app)
  .post('/auth/login')
  .send({
    email: credentials.email,
    password: credentials.password,
    browser: 'Chrome',
    os: 'Windows',
    loggedIn: 1,
    updatedAt: Date.now(),
  });

expect(response.status).toBe(200);
expect(response.body.data).toHaveProperty('token');
const token = response.body.data.token;
const orgId = response.body.data.organizations[0]._id.toString();
```

### 2. Testing Protected Endpoints
```typescript
const response = await request(app)
  .get('/customer-file')
  .set('Authorization', `Bearer ${token}`)
  .set('organization', orgId);

expect(response.status).toBe(200);
```

### 3. Creating Customer Files
```typescript
const response = await request(app)
  .post('/customer-file/customer_details')
  .set('Authorization', `Bearer ${token}`)
  .set('organization', orgId)
  .field('loanType', 'Personal Loan')
  .field('fileBranch', 'BR001')
  .field('customerDetails[firstName]', 'John')
  .field('customerDetails[lastName]', 'Doe')
  .field('customerDetails[phoneNumber]', '9876543210')
  .field('customerDetails[aadhaarNumber]', '123456789012')
  .field('customerDetails[dateOfBirth]', '1990-01-01')
  .field('customerDetails[sex]', 'Male')
  .field('customerDetails[maritalStatus]', 'Single')
  .field('customerDetails[qualification]', 'Graduate')
  .field('customerDetails[currentAddress]', '123 Main Street');

expect(response.status).toBe(200);
const fileId = response.body.data._id;
```

### 4. File Upload Testing
```typescript
import path from 'path';

const testFilePath = path.join(__dirname, '../fixtures/test-cibil.txt');

const response = await request(app)
  .post(`/customer-file/file-operations/${fileId}/cibil-score`)
  .set('Authorization', `Bearer ${token}`)
  .set('organization', orgId)
  .field('cibilDetails[score]', '750')
  .field('cibilDetails[remarks]', 'Good credit score')
  .attach('cibilDetails[file]', testFilePath);
```

### 5. Testing Organization Isolation
```typescript
// Create file in Org 1
const org1Token = /* login as org1 user */;
const org1Id = /* org1 ID */;
const fileResponse = await request(app)
  .post('/customer-file/customer_details')
  .set('Authorization', `Bearer ${org1Token}`)
  .set('organization', org1Id)
  .field(/* file data */);
const fileId = fileResponse.body.data._id;

// Try to access from Org 2 (should fail)
const org2Token = /* login as org2 user */;
const org2Id = /* org2 ID */;
const accessResponse = await request(app)
  .get(`/customer-file/${fileId}`)
  .set('Authorization', `Bearer ${org2Token}`)
  .set('organization', org2Id);

// Should be blocked
expect(accessResponse.status).toBeGreaterThanOrEqual(400);
```

### 6. Testing Permissions
```typescript
// Salesman tries to verify step (no permission)
const response = await request(app)
  .post('/customer-file/file-operations/verify-step')
  .set('Authorization', `Bearer ${salesmanToken}`)
  .set('organization', orgId)
  .send({
    fileId: fileId,
    step: 'customerDetails',
    isVerified: true,
  });

// Should be blocked
expect(response.status).toBeGreaterThanOrEqual(400);
expect(response.body).toHaveProperty('errorMessage');
expect(response.body.errorMessage).toContain("don't have access");
```

## Test Categories

### 1. Authentication Tests (`auth.test.ts`)
- User login with valid credentials
- Login failure scenarios (invalid password, non-existent user, deactivated user)
- Logout functionality
- Token generation and validation

### 2. Back Office Operations Tests (`backOfficeOperations.test.ts`)
- File step verification
- Telephone verification
- CIBIL score upload
- Customer file comments
- Permission enforcement

### 3. Organization Isolation Tests (`organizationIsolation.test.ts`)
**Critical security tests ensuring multi-tenancy isolation:**
- Cross-org file list isolation
- Cross-org file access prevention
- Cross-org file update prevention
- Cross-org file approval prevention
- Organization filtering across all endpoints
- Organization header validation

## Best Practices

### ✅ DO:
- Use `beforeAll` for database seeding (runs once per test suite)
- Clean up database in `afterAll`
- Use descriptive test names that explain what is being tested
- Test both success and failure scenarios
- Verify status codes AND response body structure
- Use timeouts for async operations (60000ms for beforeAll)
- Group related tests in `describe` blocks
- Log important data for debugging (`console.log` in tests is OK)

### ❌ DON'T:
- Don't seed data in `beforeEach` unless absolutely necessary (slow)
- Don't hard-code IDs or tokens - get them from login/creation responses
- Don't share state between test files
- Don't skip cleanup in `afterAll`
- Don't test multiple unrelated features in one test
- Don't ignore failing tests - fix them or investigate why they fail

## Debugging Tests

### Enable Verbose Logging
```bash
npm run test:e2e -- --verbose
```

### Run Single Test
```typescript
it.only('should test specific scenario', async () => {
  // Only this test will run
});
```

### Skip Problematic Test Temporarily
```typescript
it.skip('should test broken feature', async () => {
  // This test will be skipped
});
```

### Debug with Chrome DevTools
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```
Then open `chrome://inspect` in Chrome

## Troubleshooting

### Tests Fail to Connect to Database
**Problem**: MongoDB Memory Server initialization fails
**Solutions**:
- Ensure MongoDB Memory Server is properly installed: `pnpm install mongodb-memory-server --save-dev`
- Check Node.js version compatibility (requires Node 16+)
- Clear `node_modules` and reinstall

### Port Already in Use Errors
**Problem**: `EADDRINUSE: address already in use 0.0.0.0:3000`
**Solutions**:
- Stop any running instances of the backend server
- Kill zombie processes: `lsof -ti:3000 | xargs kill` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)

### Timeout Errors
**Problem**: Tests fail with "Timeout - Async callback was not invoked within the timeout"
**Solutions**:
- Increase timeout in `beforeAll`: `beforeAll(async () => { ... }, 120000)`
- Check for hanging async operations (missing `await`)
- Verify database connection is stable

### Authentication Failures
**Problem**: "User Not Found" or "Invalid Token" errors
**Solutions**:
- Verify token is being extracted correctly (Bearer prefix stripped)
- Check that database was seeded properly
- Verify organization ID is valid and matches user's organizations
- Ensure test user exists in seeded data

### Permission Errors
**Problem**: "You don't have access to perform this action"
**Solutions**:
- Verify user role has required permissions in `seedDatabase.ts`
- Check that roleRef is properly populated
- Ensure middleware is checking permissions correctly

### File Creation Failures
**Problem**: Validation errors when creating customer files
**Solutions**:
- Ensure all required fields are provided (`loanType`, `fileBranch`, customer details)
- Verify branch ID matches user's branches array
- Check that organization ID is valid

## Test Coverage Thresholds

Current coverage thresholds (from `jest.config.js`):
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

Coverage is collected from all `src/**/*.ts` files except:
- Type definition files (`*.d.ts`)
- Test files (`__tests__/**`)
- Main entry point (`index.ts`)

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:
- No external dependencies required
- In-memory database (no MongoDB server needed)
- Mocked AWS S3 and Firebase services
- Fast execution (< 5 minutes for full suite)

**GitHub Actions Example**:
```yaml
name: Run E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:e2e
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

**Last Updated**: November 2, 2025
**Test Framework**: Jest + Supertest
**Database**: MongoDB Memory Server
**Coverage Tool**: Jest Coverage
