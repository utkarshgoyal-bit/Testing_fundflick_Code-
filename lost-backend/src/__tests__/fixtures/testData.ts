/**
 * Test Data Fixtures
 * Centralized test data for use across test suites
 */

// Sample User Data
export const testUsers = {
  admin: {
    email: 'admin@fundflick.com',
    password: 'Admin@123',
    role: 'SUPER_ADMIN',
    firstName: 'Test',
    lastName: 'Admin',
    phone: '1234567890',
  },
  branchManager: {
    email: 'manager@fundflick.com',
    password: 'Manager@123',
    role: 'BRANCH_MANAGER',
    firstName: 'Test',
    lastName: 'Manager',
    phone: '1234567891',
  },
  salesman: {
    email: 'salesman@fundflick.com',
    password: 'Sales@123',
    role: 'SALESMAN',
    firstName: 'Test',
    lastName: 'Salesman',
    phone: '1234567892',
  },
};

// Sample Organization Data
export const testOrganization = {
  name: 'Test Finance Organization',
  email: 'org@fundflick.com',
  phone: '9876543210',
  address: '123 Test Street, Test City',
  gstNumber: 'TEST123456789',
  panNumber: 'TESTPAN123',
};

// Sample Branch Data
export const testBranch = {
  name: 'Test Branch',
  code: 'TB001',
  address: '456 Branch Street, Test City',
  phone: '9876543211',
  email: 'branch@fundflick.com',
};

// Sample Customer Data
export const testCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '9876543212',
  panNumber: 'ABCDE1234F',
  aadharNumber: '123456789012',
  dateOfBirth: '1990-01-01',
  address: {
    street: '789 Customer Lane',
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
  },
};

// Sample Loan Data
export const testLoan = {
  loanAmount: 100000,
  interestRate: 12.5,
  tenure: 12, // months
  processingFee: 1000,
  loanType: 'PERSONAL_LOAN',
  purpose: 'Business Expansion',
};

// Sample EMI Data
export const testEMI = {
  emiAmount: 8884.88,
  dueDate: '2025-02-01',
  status: 'PENDING',
};

// Sample Payment Data
export const testPayment = {
  amount: 8884.88,
  paymentMode: 'CASH',
  paymentDate: '2025-02-01',
  transactionId: 'TXN123456',
  remarks: 'First EMI payment',
};

// Sample Task Data
export const testTask = {
  title: 'Verify Customer Documents',
  description: 'Review and verify all submitted customer documents',
  priority: 'HIGH',
  status: 'PENDING',
  dueDate: '2025-02-15',
};

// Helper function to create variations of test data
export const createTestUser = (overrides: any = {}) => ({
  ...testUsers.admin,
  ...overrides,
  email: overrides.email || `test-${Date.now()}@example.com`,
});

export const createTestCustomer = (overrides: any = {}) => ({
  ...testCustomer,
  ...overrides,
  email: overrides.email || `customer-${Date.now()}@example.com`,
  phone: overrides.phone || `98765${Math.floor(10000 + Math.random() * 90000)}`,
});

export const createTestLoan = (overrides: any = {}) => ({
  ...testLoan,
  ...overrides,
});

export const createTestOrganization = (overrides: any = {}) => ({
  ...testOrganization,
  ...overrides,
  email: overrides.email || `org-${Date.now()}@example.com`,
});

export const createTestBranch = (overrides: any = {}) => ({
  ...testBranch,
  ...overrides,
  code: overrides.code || `BR${Math.floor(1000 + Math.random() * 9000)}`,
});

// Customer File Test Data
export const testCustomerFile = {
  customerDetails: {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    fatherName: 'Ramesh Kumar',
    motherName: 'Sunita Kumar',
    spouseName: '',
    dateOfBirth: '1985-05-15',
    sex: 'Male',
    maritalStatus: 'Married',
    qualification: 'Graduate',
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    phoneNumber: '9876543210',
    alternatePhoneNumber: '9876543211',
    email: 'rajesh.kumar@example.com',
    noOfDependents: 2,
    currentAddress: '123 Main Street, Mumbai',
    permanentAddress: '123 Main Street, Mumbai',
  },
  address: {
    currentAddressLine1: '123 Main Street',
    currentAddressLine2: 'Near Railway Station',
    currentCity: 'Mumbai',
    currentState: 'Maharashtra',
    currentPincode: '400001',
    currentCountry: 'India',
    permanentAddressLine1: '123 Main Street',
    permanentAddressLine2: 'Near Railway Station',
    permanentCity: 'Mumbai',
    permanentState: 'Maharashtra',
    permanentPincode: '400001',
    permanentCountry: 'India',
    residenceType: 'Owned',
    yearsAtCurrentAddress: 5,
  },
  associate: {
    firstName: 'Priya',
    lastName: 'Kumar',
    relationship: 'Spouse',
    dateOfBirth: '1988-08-20',
    phoneNumber: '9876543212',
    aadhaarNumber: '210987654321',
    panNumber: 'FGHIJ5678K',
    occupation: 'Teacher',
    income: 30000,
  },
  income: {
    employmentType: 'Salaried',
    employerName: 'ABC Company Pvt Ltd',
    designation: 'Senior Manager',
    monthlyIncome: 75000,
    yearsInCurrentJob: 3,
    totalWorkExperience: 10,
    additionalIncome: 10000,
    additionalIncomeSource: 'Rental Income',
  },
  liability: {
    existingLoans: [
      {
        loanType: 'Home Loan',
        bank: 'HDFC Bank',
        emiAmount: 15000,
        outstandingAmount: 500000,
        tenure: 36,
      },
    ],
    creditCardOutstanding: 25000,
    otherLiabilities: 0,
  },
  collateral: {
    collateralType: 'Vehicle',
    vehicleType: 'Car',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2020,
    registrationNumber: 'MH01AB1234',
    chassisNumber: 'CHASSIS123456',
    engineNumber: 'ENGINE123456',
    estimatedValue: 600000,
  },
  bank: {
    accountHolderName: 'Rajesh Kumar',
    bankName: 'ICICI Bank',
    accountNumber: '1234567890',
    ifscCode: 'ICIC0001234',
    accountType: 'Savings',
    branchName: 'Mumbai Main',
  },
  loanDetails: {
    loanType: 'Personal Loan',
    loanAmount: 200000,
    tenure: 24,
    purpose: 'Business Expansion',
    fileBranch: 'BR001',
  },
};

// Helper to create customer file data with overrides
export const createTestCustomerFile = (overrides: any = {}) => ({
  ...testCustomerFile,
  ...overrides,
  customerDetails: {
    ...testCustomerFile.customerDetails,
    ...(overrides.customerDetails || {}),
    aadhaarNumber:
      overrides.customerDetails?.aadhaarNumber ||
      `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    panNumber:
      overrides.customerDetails?.panNumber ||
      `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}`,
    phoneNumber:
      overrides.customerDetails?.phoneNumber || `98765${Math.floor(10000 + Math.random() * 90000)}`,
  },
});
