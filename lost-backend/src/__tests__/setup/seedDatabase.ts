/**
 * Database Seeding Utilities for E2E Tests
 * Provides functions to populate test database with required data
 */

import mongoose from 'mongoose';
import { encrypt } from '../../helper/encrypt';
import OrganizationSchema from '../../schema/organization';
import EmployeeSchema from '../../schema/employee';
import UserSchema from '../../schema/auth';
import RolesSchema from '../../schema/roles';
import { STATUS } from '../../shared/enums';

// Store seeded IDs for use in tests
export const seededData = {
  organizations: {} as Record<string, any>,
  employees: {} as Record<string, any>,
  users: {} as Record<string, any>,
  roles: {} as Record<string, any>,
};

/**
 * Clean all collections in the test database
 */
export const cleanDatabase = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    // Reset seeded data
    seededData.organizations = {};
    seededData.employees = {};
    seededData.users = {};
    seededData.roles = {};

    console.log('🧹 Test database cleaned');
  } catch (error) {
    console.error('❌ Error cleaning test database:', error);
    throw error;
  }
};

/**
 * Seed test organizations
 */
export const seedOrganizations = async (): Promise<void> => {
  try {
    const org1Id = new mongoose.Types.ObjectId();
    const org2Id = new mongoose.Types.ObjectId();
    const creatorId = new mongoose.Types.ObjectId();

    const organizations = [
      {
        _id: org1Id,
        id: 'test-org-1',
        name: 'Test Organization 1',
        email: 'org1@fundflick.test',
        status: STATUS.ACTIVE,
        modules: ['LOS', 'LMS'],
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
      },
      {
        _id: org2Id,
        id: 'test-org-2',
        name: 'Test Organization 2',
        email: 'org2@fundflick.test',
        status: STATUS.ACTIVE,
        modules: ['LOS'],
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
      },
    ];

    const created = await OrganizationSchema.insertMany(organizations);

    seededData.organizations.org1 = created[0];
    seededData.organizations.org2 = created[1];

    console.log('✅ Seeded 2 test organizations');
  } catch (error) {
    console.error('❌ Error seeding organizations:', error);
    throw error;
  }
};

/**
 * Seed test roles with permissions
 */
export const seedRoles = async (): Promise<void> => {
  try {
    const org1 = seededData.organizations.org1;
    const org2 = seededData.organizations.org2;
    const creatorId = new mongoose.Types.ObjectId();

    if (!org1 || !org2) {
      throw new Error('Organizations must be seeded before roles');
    }

    const roles = [
      // Sales Role - Basic customer file permissions
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        name: 'Sales Role',
        permissions: [
          'customer_file_view',
          'customer_file_create',
          'customer_file_update',
          'customer_file_view_self',
        ],
        rolesAccess: [],
        createdBy: creatorId,
      },
      // Back Office Role - Has verify step and telephone verification permissions
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        name: 'Back Office Role',
        permissions: [
          'customer_file_view',
          'customer_file_view_others',
          'verify_step',
          'telephone_verification',
          'customer_file_verify_step',
          'customer_file_back_office',
          'customer_file_comment',
        ],
        rolesAccess: [],
        createdBy: creatorId,
      },
      // Credit Manager Role - Has approval/rejection permissions
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        name: 'Credit Manager Role',
        permissions: [
          'customer_file_view',
          'customer_file_view_others',
          'customer_file_task_approved',
          'customer_file_task_rejected',
        ],
        rolesAccess: [],
        createdBy: creatorId,
      },
      // Marketing Manager Role - Has task pending (send to review) permission
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        name: 'Marketing Manager Role',
        permissions: [
          'customer_file_view',
          'customer_file_view_others',
          'customer_file_task_pending',
          'customer_file_send_review',
        ],
        rolesAccess: [],
        createdBy: creatorId,
      },
      // Payment Collection Role - Has payment collection permissions
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        name: 'Payment Collection Role',
        permissions: [
          'customer_file_view',
          'customer_file_view_others',
          'customer_file_fees',
        ],
        rolesAccess: [],
        createdBy: creatorId,
      },
      // Org2 Manager Role - Has basic permissions for org2
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org2._id,
        name: 'Org2 Manager Role',
        permissions: [
          'customer_file_view',
          'customer_file_create',
          'customer_file_update',
          'customer_file_view_others',
        ],
        rolesAccess: [],
        createdBy: creatorId,
      },
    ];

    const created = await RolesSchema.insertMany(roles);

    seededData.roles.salesRole = created[0];
    seededData.roles.backOfficeRole = created[1];
    seededData.roles.creditManagerRole = created[2];
    seededData.roles.marketingManagerRole = created[3];
    seededData.roles.paymentRole = created[4];
    seededData.roles.org2ManagerRole = created[5];

    console.log('✅ Seeded 6 test roles with permissions');
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
};

/**
 * Seed test employees
 */
export const seedEmployees = async (): Promise<void> => {
  try {
    const org1 = seededData.organizations.org1;
    const org2 = seededData.organizations.org2;
    const creatorId = new mongoose.Types.ObjectId();

    if (!org1 || !org2) {
      throw new Error('Organizations must be seeded before employees');
    }

    const employees = [
      // Org 1 Employees
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Admin',
        lastName: 'User',
        eId: 'EMP001',
        email: 'admin@test.com',
        designation: 'Administrator',
        role: 'Super Admin',
        sex: 'Male',
        dob: Date.now() - 30 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 365 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Single',
        addressLine1: '123 Admin Street',
        country: 'India',
        state: 'Maharashtra',
        mobile: '9876543210',
        uid: '123456789012',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Sales',
        lastName: 'Person',
        eId: 'EMP002',
        email: 'salesman@test.com',
        designation: 'Sales Executive',
        role: 'Permanent',
        sex: 'Male',
        dob: Date.now() - 28 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Single',
        addressLine1: '456 Sales Avenue',
        country: 'India',
        state: 'Maharashtra',
        mobile: '9876543211',
        uid: '123456789013',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Inactive',
        lastName: 'User',
        eId: 'EMP003',
        email: 'inactive@test.com',
        designation: 'Sales Executive',
        role: 'Permanent',
        sex: 'Female',
        dob: Date.now() - 25 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Single',
        addressLine1: '789 Inactive Road',
        country: 'India',
        state: 'Gujarat',
        mobile: '9876543212',
        uid: '123456789014',
        isActive: false,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
      // Org 2 Employee
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org2._id,
        firstName: 'Org2',
        lastName: 'User',
        eId: 'EMP004',
        email: 'org2user@test.com',
        designation: 'Manager',
        role: 'Permanent',
        sex: 'Male',
        dob: Date.now() - 32 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 200 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Married',
        addressLine1: '321 Org2 Street',
        country: 'India',
        state: 'Karnataka',
        mobile: '9876543213',
        uid: '123456789015',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org2.name,
        MONGO_DELETED: false,
      },
      // Back Office User
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Back',
        lastName: 'Office',
        eId: 'EMP005',
        email: 'backoffice@test.com',
        designation: 'Back Office Executive',
        role: 'Permanent',
        sex: 'Female',
        dob: Date.now() - 26 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 150 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Single',
        addressLine1: '111 Back Office Lane',
        country: 'India',
        state: 'Maharashtra',
        mobile: '9876543214',
        uid: '123456789016',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
      // Credit Manager
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Credit',
        lastName: 'Manager',
        eId: 'EMP006',
        email: 'creditmanager@test.com',
        designation: 'Credit Manager',
        role: 'Permanent',
        sex: 'Male',
        dob: Date.now() - 35 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 500 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Married',
        addressLine1: '222 Credit Street',
        country: 'India',
        state: 'Maharashtra',
        mobile: '9876543215',
        uid: '123456789017',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
      // Marketing Manager
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Marketing',
        lastName: 'Manager',
        eId: 'EMP007',
        email: 'marketingmanager@test.com',
        designation: 'Marketing Manager',
        role: 'Permanent',
        sex: 'Female',
        dob: Date.now() - 33 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 400 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Married',
        addressLine1: '333 Marketing Avenue',
        country: 'India',
        state: 'Maharashtra',
        mobile: '9876543216',
        uid: '123456789018',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
      // Payment Collector
      {
        _id: new mongoose.Types.ObjectId(),
        organization: org1._id,
        firstName: 'Payment',
        lastName: 'Collector',
        eId: 'EMP008',
        email: 'paymentcollector@test.com',
        designation: 'Payment Collector',
        role: 'Permanent',
        sex: 'Male',
        dob: Date.now() - 27 * 365 * 24 * 60 * 60 * 1000,
        joiningDate: Date.now() - 100 * 24 * 60 * 60 * 1000,
        maritalStatus: 'Single',
        addressLine1: '444 Payment Road',
        country: 'India',
        state: 'Maharashtra',
        mobile: '9876543217',
        uid: '123456789019',
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        orgName: org1.name,
        MONGO_DELETED: false,
      },
    ];

    const created = await EmployeeSchema.insertMany(employees);

    seededData.employees.admin = created[0];
    seededData.employees.salesman = created[1];
    seededData.employees.inactive = created[2];
    seededData.employees.org2user = created[3];
    seededData.employees.backOffice = created[4];
    seededData.employees.creditManager = created[5];
    seededData.employees.marketingManager = created[6];
    seededData.employees.paymentCollector = created[7];

    console.log('✅ Seeded 8 test employees');
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    throw error;
  }
};

/**
 * Seed test users (with authentication)
 */
export const seedUsers = async (): Promise<void> => {
  try {
    const org1 = seededData.organizations.org1;
    const org2 = seededData.organizations.org2;
    const {
      admin,
      salesman,
      inactive,
      org2user,
      backOffice,
      creditManager,
      marketingManager,
      paymentCollector,
    } = seededData.employees;
    const {
      salesRole,
      backOfficeRole,
      creditManagerRole,
      marketingManagerRole,
      paymentRole,
    } = seededData.roles;

    if (!admin || !salesman || !inactive || !org2user) {
      throw new Error('Employees must be seeded before users');
    }

    const { org2ManagerRole } = seededData.roles;

    if (!salesRole || !backOfficeRole || !creditManagerRole || !marketingManagerRole || !paymentRole || !org2ManagerRole) {
      throw new Error('Roles must be seeded before users');
    }

    // Hash test password
    const hashedPassword = await encrypt('Test@123');
    const creatorId = new mongoose.Types.ObjectId();

    const users = [
      // Admin User (Super Admin - no roleRef needed, has all permissions)
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: admin._id,
        password: hashedPassword,
        role: 'Super Admin',
        branches: ['BR001'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Salesman User (with Sales Role - no special permissions)
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: salesman._id,
        password: hashedPassword,
        role: 'Sales Man',
        roleRef: salesRole._id,
        branches: ['BR001', 'BR002'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Inactive User
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: inactive._id,
        password: hashedPassword,
        role: 'Sales Man',
        branches: ['BR001'],
        loggedIn: 0,
        isActive: false, // Inactive user
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Org 2 User
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: org2user._id,
        password: hashedPassword,
        role: 'Branch Manager',
        roleRef: org2ManagerRole._id,
        branches: ['BR003'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org2._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Back Office User (with Back Office Role)
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: backOffice._id,
        password: hashedPassword,
        role: 'Back Office',
        roleRef: backOfficeRole._id,
        branches: ['BR001'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Credit Manager User (with Credit Manager Role)
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: creditManager._id,
        password: hashedPassword,
        role: 'Credit Manager',
        roleRef: creditManagerRole._id,
        branches: ['BR001'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Marketing Manager User (with Marketing Manager Role)
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: marketingManager._id,
        password: hashedPassword,
        role: 'Marketing Manager',
        roleRef: marketingManagerRole._id,
        branches: ['BR001'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
      // Payment Collector User (with Payment Collection Role)
      {
        _id: new mongoose.Types.ObjectId(),
        employeeId: paymentCollector._id,
        password: hashedPassword,
        role: 'Payment Collector',
        roleRef: paymentRole._id,
        branches: ['BR001'],
        loggedIn: 0,
        isActive: true,
        createdAt: Date.now(),
        createdBy: creatorId,
        updatedAt: Date.now(),
        organizations: [org1._id],
        ledgerBalance: 0,
        ledgerBalanceHistory: [],
        MONGO_DELETED: false,
      },
    ];

    const created = await UserSchema.insertMany(users);

    seededData.users.admin = created[0];
    seededData.users.salesman = created[1];
    seededData.users.inactive = created[2];
    seededData.users.org2user = created[3];
    seededData.users.backOffice = created[4];
    seededData.users.creditManager = created[5];
    seededData.users.marketingManager = created[6];
    seededData.users.paymentCollector = created[7];

    console.log('✅ Seeded 8 test users with password: Test@123');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

/**
 * Seed all test data in correct order
 */
export const seedAll = async (): Promise<void> => {
  console.log('🌱 Starting database seeding...');

  await cleanDatabase();
  await seedOrganizations();
  await seedRoles();
  await seedEmployees();
  await seedUsers();

  console.log('✅ Database seeding complete!');
  console.log('📊 Seeded data:', {
    organizations: Object.keys(seededData.organizations).length,
    roles: Object.keys(seededData.roles).length,
    employees: Object.keys(seededData.employees).length,
    users: Object.keys(seededData.users).length,
  });
};

/**
 * Get seeded test credentials for login
 */
export const getTestCredentials = (
  userType:
    | 'admin'
    | 'salesman'
    | 'inactive'
    | 'org2user'
    | 'backOffice'
    | 'creditManager'
    | 'marketingManager'
    | 'paymentCollector'
) => {
  const employeeMap = {
    admin: seededData.employees.admin,
    salesman: seededData.employees.salesman,
    inactive: seededData.employees.inactive,
    org2user: seededData.employees.org2user,
    backOffice: seededData.employees.backOffice,
    creditManager: seededData.employees.creditManager,
    marketingManager: seededData.employees.marketingManager,
    paymentCollector: seededData.employees.paymentCollector,
  };

  const employee = employeeMap[userType];

  if (!employee) {
    throw new Error(`Employee ${userType} not found in seeded data`);
  }

  return {
    email: employee.email,
    password: 'Test@123',
  };
};
